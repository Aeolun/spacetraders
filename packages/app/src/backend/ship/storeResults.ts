import {prisma, MarketPrice} from "@app/prisma";
import {
    CreateShipShipScan201Response,
    CreateShipShipScan201ResponseData,
    ScannedWaypoint,
    Waypoint,
    CreateShipWaypointScan201ResponseData, GetSystemWaypoints200Response, GetMarket200Response, TradeSymbol
} from "spacetraders-sdk";
import {processShip} from "@app/ship/updateShips";

export async function storeWaypointScan(systemSymbol: string, data: CreateShipWaypointScan201ResponseData | GetSystemWaypoints200Response) {
    const waypoints: (Waypoint | ScannedWaypoint)[] = 'waypoints' in data ? data.waypoints : data.data
    await Promise.all(waypoints.map(async waypoint => {
        return storeWaypoint(waypoint)
    }))

    await prisma.system.update({
        where: {
            symbol: systemSymbol
        },
        data: {
            waypointsRetrieved: true
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
                })
            },
            orbitals: {
                connect: waypoint.orbitals.map(orb => {
                    return {
                        symbol: orb.symbol
                    }
                })
            }
        }
        await prisma.waypoint.upsert({
            where: {
                symbol: waypoint.symbol
            },
            create: {
                ...updateValues,
                symbol: waypoint.symbol,
                type: waypoint.type,
                systemSymbol: waypoint.systemSymbol,
                x: waypoint.x,
                y: waypoint.y,
            },
            update: updateValues
        })
    } catch(error) {
        console.error("Issue updating waypoint", error.toString())
    }
}

export async function storeMarketInformation(data: GetMarket200Response) {
    const importGoods = data.data.imports.map(i => i.symbol)
    const exportGoods = data.data.exports.map(i => i.symbol)
    //const exhangeGoods = data.data.exchange.map(i => i.symbol)

    const marketData = []
    data.data.tradeGoods.map(good => {
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

    await Promise.all(marketData.map(data => {
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
}


export async function storeShipScan(data: CreateShipShipScan201ResponseData) {
    await Promise.all(data.ships.map(async ship => {
        return processShip(ship)
    }))
}