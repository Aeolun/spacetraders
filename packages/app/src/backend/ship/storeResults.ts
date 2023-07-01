import {prisma, MarketPrice} from "@app/prisma";
import {
    CreateShipShipScan201Response,
    CreateShipShipScan201ResponseData,
    ScannedWaypoint,
    Waypoint,
    CreateShipWaypointScan201ResponseData,
    GetSystemWaypoints200Response,
    GetMarket200Response,
    Shipyard,
    TradeSymbol,
    GetJumpGate200Response, Chart
} from "spacetraders-sdk";
import {
    processModule,
    processMount,
    processReactor,
    processShip,
    processShipEngine,
    processShipFrame
} from "@app/ship/updateShips";

export async function storeWaypointScan(systemSymbol: string, data: CreateShipWaypointScan201ResponseData | GetSystemWaypoints200Response) {
    const waypoints: (Waypoint | ScannedWaypoint)[] = 'waypoints' in data ? data.waypoints : data.data

    let faction
    let hasUncharted = false, hasMarket = false, hasShipyard = false, hasBelt = false
    await Promise.all(waypoints.map(async waypoint => {
        if (waypoint.faction?.symbol) {
            faction = waypoint.faction.symbol
        }
        waypoint.traits.forEach(trait => {
            if (trait.symbol === 'UNCHARTED') {
                hasUncharted = true
            }
            if (trait.symbol === 'MARKETPLACE') {
                hasMarket = true
            }
            if (trait.symbol === 'SHIPYARD') {
                hasShipyard = true
            }
            if (trait.symbol === 'COMMON_METAL_DEPOSITS' || trait.symbol === 'PRECIOUS_METAL_DEPOSITS' || trait.symbol === 'MINERAL_DEPOSITS') {
                hasBelt = true
            }
        })
        return storeWaypoint(waypoint)
    }))

    await prisma.system.update({
        where: {
            symbol: systemSymbol
        },
        data: {
            waypointsRetrieved: true,
            hasUncharted: hasUncharted,
            hasMarket: hasMarket,
            hasShipyard: hasShipyard,
            hasBelt: hasBelt,
            majorityFaction: faction
        }
    })

}

export async function storeWaypoint(waypoint: Waypoint | ScannedWaypoint) {
    if (waypoint.faction) {
        try {
            await prisma.faction.upsert({
                where: {
                    symbol: waypoint.faction.symbol
                },
                create: {
                    symbol: waypoint.faction.symbol,
                    headquartersSymbol: null,
                },
                update: {},
            })
        } catch(error) {
            console.log("Error creating", waypoint.faction, error)
        }
    }


    try {
        const updateValues = {
            factionSymbol: waypoint.faction?.symbol,
            chartSubmittedBy: waypoint.chart?.submittedBy,
            chartSubmittedOn: waypoint.chart?.submittedOn,
            type: waypoint.type,
            systemSymbol: waypoint.systemSymbol,
            x: waypoint.x,
            y: waypoint.y,
            traits: {
                connectOrCreate: waypoint.traits.map(trait => {
                    return {
                        where: {
                            symbol: trait.symbol,
                        },
                        create: {
                            symbol: trait.symbol,
                            name: trait.name,
                            description: trait.description
                        }
                    }
                }),
            },
            orbitals: {
                connect: waypoint.orbitals.map(orb => {
                    return {
                        symbol: orb.symbol
                    }
                })
            }
        }
        await prisma.waypoint.update({
            where: {
                symbol: waypoint.symbol
            },
            data: {
                traits: {
                    set: []
                }
            }
        })
        return prisma.waypoint.upsert({
            where: {
                symbol: waypoint.symbol
            },
            include: {
                traits: true,
                jumpgate: {
                    include: {
                        validJumpTargets: true
                    }
                }
            },
            create: {
                ...updateValues,
                symbol: waypoint.symbol,
            },
            update: updateValues
        })
    } catch(error) {
        console.error("Issue updating waypoint", error.toString())
    }
}

export async function storeJumpGateInformation(systemSymbol: string, waypointSymbol: string, data: GetJumpGate200Response) {
    await prisma.system.update({
        where: {
            symbol: systemSymbol
        },
        data: {
            hasJumpGate: true,
            jumpgateRange: data.data.jumpRange
        }
    })
    console.log('save jump infomration', systemSymbol, data.data.jumpRange)

    await prisma.jumpgate.upsert({
        where: {
            waypointSymbol: waypointSymbol
        },
        create: {
            waypointSymbol: waypointSymbol,
            range: data.data.jumpRange
        },
        update: {
            range: data.data.jumpRange
        }
    })

    await Promise.all(data.data.connectedSystems.map(system => {
        return prisma.jumpConnectedSystem.upsert({
            where: {
                fromWaypointSymbol_toWaypointSymbol: {
                    fromWaypointSymbol: waypointSymbol,
                    toWaypointSymbol: system.symbol
                }
            },
            create: {
                fromWaypointSymbol: waypointSymbol,
                toWaypointSymbol: system.symbol,
                distance: system.distance,
                x: system.x,
                y: system.y,
            },
            update: {
                distance: system.distance,
                x: system.x,
                y: system.y,
            }
        })
    }))
}

export async function storeMarketInformation(data: GetMarket200Response) {
    const importGoods = data.data.imports.map(i => i.symbol)
    const exportGoods = data.data.exports.map(i => i.symbol)
    //const exhangeGoods = data.data.exchange.map(i => i.symbol)

    const marketData = []
    data.data.tradeGoods?.map(good => {
        marketData.push({
            tradeGoodSymbol: good.symbol,
            kind: importGoods.includes(good.symbol as TradeSymbol) ? 'IMPORT' : exportGoods.includes(good.symbol as TradeSymbol) ? 'EXPORT' : 'EXCHANGE',
            waypointSymbol: data.data.symbol,
            sellPrice: good.sellPrice,
            purchasePrice: good.purchasePrice,
            tradeVolume: good.tradeVolume,
            supply: good.supply
        })
    })

    const existingGoods = await prisma.tradeGood.findMany({
        where: {
            symbol: {
                in: marketData.map(good => good.tradeGoodSymbol)
            }
        }
    })
    await Promise.all(marketData.map(async data => {
        if (!existingGoods.find(good => good.symbol === data.tradeGoodSymbol && good.symbol !== good.name)) {
            await prisma.tradeGood.upsert({
                where: {
                    symbol: data.tradeGoodSymbol
                },
                create: {
                    symbol: data.tradeGoodSymbol,
                    name: data.tradeGoodSymbol,
                    description: data.tradeGoodSymbol
                },
                update: {
                    name: data.tradeGoodSymbol,
                    description: data.tradeGoodSymbol
                }
            })
        }
        return prisma.marketPrice.upsert({
            where: {
                waypointSymbol_tradeGoodSymbol: {
                    waypointSymbol: data.waypointSymbol,
                    tradeGoodSymbol: data.tradeGoodSymbol
                }
            },
            create: data,
            update: data
        })
    }))

    console.log(`Data stored for ${marketData.length} items in ${data.data.symbol}`)
}

export async function processShipyard(data: Shipyard) {
    if (data.ships) {
        return Promise.all(data.ships.map(async ship => {
            await prisma.$transaction(async () => {
                await prisma.shipConfiguration.upsert({
                    where: {
                        symbol: ship.type,
                    },
                    create: {
                        symbol: ship.type,

                        name: ship.name,
                        description: ship.description,

                        frameSymbol: ship.frame.symbol,
                        engineSymbol: ship.engine.symbol,
                        reactorSymbol: ship.reactor.symbol,
                    },
                    update: {
                        name: ship.name,
                        description: ship.description,

                        frameSymbol: ship.frame.symbol,
                        engineSymbol: ship.engine.symbol,
                        reactorSymbol: ship.reactor.symbol,
                    }
                })
                await processShipEngine(ship.engine)
                await processShipFrame(ship.frame)
                await processReactor(ship.reactor)
                for (const module of ship.modules) {
                    await processModule(module)
                }
                for (const mount of ship.mounts) {
                    await processMount(mount)
                }
                await prisma.shipConfigurationModule.deleteMany({
                    where: {
                        shipConfigurationSymbol: ship.type
                    }
                })
                await prisma.shipConfigurationModule.createMany({
                    data: ship.modules.map(module => {
                        return {
                            shipConfigurationSymbol: ship.type,
                            moduleSymbol: module.symbol
                        }
                    })
                })
                await prisma.shipConfigurationMount.deleteMany({
                    where: {
                        shipConfigurationSymbol: ship.type
                    }
                })
                await prisma.shipConfigurationMount.createMany({
                    data: ship.mounts.map(module => {
                        return {
                            shipConfigurationSymbol: ship.type,
                            mountSymbol: module.symbol
                        }
                    })
                })
                await prisma.shipyardModel.upsert({
                    where: {
                        shipConfigurationSymbol_waypointSymbol: {
                            shipConfigurationSymbol: ship.type,
                            waypointSymbol: data.symbol,
                        }
                    },
                    create: {
                        shipConfigurationSymbol: ship.type,
                        waypointSymbol: data.symbol,
                        price: ship.purchasePrice
                    },
                    update: {
                        price: ship.purchasePrice
                    }
                })
            })
        }))
    } else if (data.shipTypes) {
        return Promise.all(data.shipTypes.map(async ship => {
            await prisma.shipyardModel.upsert({
                where: {
                    shipConfigurationSymbol_waypointSymbol: {
                        shipConfigurationSymbol: ship.type,
                        waypointSymbol: data.symbol,
                    }
                },
                create: {
                    shipConfigurationSymbol: ship.type,
                    waypointSymbol: data.symbol,
                },
                update: {}
            })
        }))
    } else {
        return Promise.resolve([])
    }
}

export async function storeShipScan(data: CreateShipShipScan201ResponseData) {
    await Promise.all(data.ships.map(async ship => {
        return processShip(ship)
    }))
}