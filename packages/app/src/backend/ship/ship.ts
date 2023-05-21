import {createOrGetAgentQueue, Queue } from "@app/lib/queue";
import {logShipAction} from "@app/lib/log";
import api, {APIInstance} from "@app/lib/createApi";
import {storeMarketInformation, storeShipScan, storeWaypoint, storeWaypointScan} from "@app/ship/storeResults";
import fs from "fs";
import {
    ExtractResources201Response,
    ExtractResources201ResponseData,
    ShipNavFlightMode,
    Survey
} from "spacetraders-sdk";
import {
    processAgent,
    processCargo,
    processCooldown,
    processFuel,
    processNav,
    returnShipData
} from "@app/ship/updateShips";
import * as process from "process";
import axios from "axios";
import {Context} from "@app/context";
import createApi from "@app/lib/createApi";
import throttledQueue from "throttled-queue";

type CooldownKind = 'reactor'

const cooldowns: Record<CooldownKind, Record<string, Promise<any> | undefined>> = {
    reactor: {}
}

export class Ship {
    public api: APIInstance
    private queue: Queue

    public currentSystemSymbol: string
    public currentWaypointSymbol: string

    constructor(public token: string, public agent: string, public symbol: string) {
        this.api = createApi(token)
        this.queue = createOrGetAgentQueue(agent)
    }

    public setCurrentLocation(system:string, waypoint: string) {
        this.currentSystemSymbol = system
        this.currentWaypointSymbol = waypoint
    }

    public async updateLocation() {

        const shipInfo = await this.queue(() => this.api.fleet.getMyShip(this.symbol))

        this.currentWaypointSymbol = shipInfo.data.data.nav.waypointSymbol
        this.currentSystemSymbol = shipInfo.data.data.nav.systemSymbol
    }

    log(message: string) {
        logShipAction(this.symbol, message)
    }

    private setCooldown(kind: CooldownKind, waitTime: number) {
        this.log(`Set ${kind} cooldown to expire in ${waitTime} ms`)
        cooldowns[kind][this.symbol] = new Promise((resolve, reject) => {
            setTimeout(() => {
                delete cooldowns[kind][this.symbol]
                resolve(true)
            }, waitTime)
        })
    }

    private async waitForCooldown(kind: CooldownKind) {
        if (cooldowns[kind][this.symbol]) {
            this.log(`Waiting for ${kind} cooldown to expire`)
            await cooldowns[kind][this.symbol]
        }
    }

    async validateCooldowns() {
        const res = await this.queue(() => {
            this.log(`Retrieving cooldowns, to wait for existing ones.`)
            return this.api.fleet.getShipCooldown(this.symbol)
        })

        if (res.status === 204) {
            return true;
        } else {
            const expire = new Date(res.data.data.expiration)
            const timeRemaining = expire.getTime() - Date.now() + 200
            this.setCooldown('reactor', timeRemaining)
            await this.waitForCooldown('reactor')
        }
    }

    async navigate(waypoint: string, waitForTimeout = true) {
        try {
            const res = await this.queue(() => {
                this.log(`Navigating ship to ${waypoint}`)
                return this.api.fleet.navigateShip(this.symbol, {
                    waypointSymbol: waypoint
                })
            })

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Navigating from ${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed.amount} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`)

            await processFuel(this.symbol, res.data.data.fuel);
            const navResult = await processNav(this.symbol, res.data.data.nav)

            if (waitForTimeout) {
                const arrivalTime = new Date(res.data.data.nav.route.arrival)
                const waitTime = arrivalTime.getTime() - Date.now() + 200
                this.log(`Waiting ${waitTime} ms until arrival`)
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(navResult)
                    }, waitTime)
                })
            } else {
                return navResult
            }
        } catch(error) {
            if (error.response?.data?.error?.code === 4204) {
                this.log(`Already at ${waypoint}`)
                return;
            } else {
                console.error('went wrong', error.response.data)
                throw error
            }
        }
    }

    async warp(waypoint: string, waitForTimeout = true) {
        try {
            const res = await this.queue(() => {
                this.log(`Navigating ship to ${waypoint}`)
                return this.api.fleet.warpShip(this.symbol, {
                    waypointSymbol: waypoint
                })
            })

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Navigating from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed.amount} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`)

            await processFuel(this.symbol, res.data.data.fuel);
            const navResult = await processNav(this.symbol, res.data.data.nav)


            if (waitForTimeout) {
                const arrivalTime = new Date(res.data.data.nav.route.arrival)
                const waitTime = arrivalTime.getTime() - Date.now() + 200
                this.log(`Waiting ${waitTime} ms until arrival`)
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(navResult)
                    }, waitTime)
                })
            } else {
                return navResult
            }
        } catch(error) {
            if (error.response?.data?.error?.code === 4204) {
                this.log(`Already at ${waypoint}`)
                return;
            } else {
                console.error('went wrong', error.response.data)
                throw error
            }
        }
    }

    async jump(system: string, waitForTimeout = true) {
        try {
            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                this.log(`Jumping ship to ${system}`)
                return this.api.fleet.jumpShip(this.symbol, {
                    systemSymbol: system
                })
            })

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Jumping from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol}`)

            const navResult = await processNav(this.symbol, res.data.data.nav)

            await processCooldown(this.symbol, res.data.data.cooldown)

            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            if (waitForTimeout) {
                const arrivalTime = new Date(res.data.data.nav.route.arrival)
                const waitTime = arrivalTime.getTime() - Date.now() + 200
                this.log(`Waiting ${waitTime} ms until arrival`)
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(navResult)
                    }, waitTime)
                })
            } else {
                return navResult
            }
        } catch(error) {
            if (error.response?.data?.error?.code === 4204) {
                this.log(`Already at ${system}`)
                return;
            } else {
                console.error('went wrong', error.response.data)
                throw error
            }
        }
    }

    async extract(survey?: Survey) {
        try {
            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                const fromDeposit = survey ? ` from deposit ${survey.signature}` : ''
                this.log(`Extracting resources${fromDeposit}`)
                return this.api.fleet.extractResources(this.symbol, {
                    survey: survey
                })
            })

            this.log(`Extracted ${res.data.data.extraction.yield.units} units of ${res.data.data.extraction.yield.symbol}, ${res.data.data.cargo.units}/${res.data.data.cargo.capacity} filled`)

            await processCooldown(this.symbol, res.data.data.cooldown)
            const newShipInfo = await processCargo(this.symbol, res.data.data.cargo)

            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            return newShipInfo;
        } catch(error) {
            if (error.response.data.error.code === 4228) {
                this.log(`Cargo at max capacity`)

                const response: ExtractResources201Response = {
                    data: {
                        extraction: {
                            ["yield"]: {
                                symbol: '',
                                units: 0,
                            },
                            shipSymbol: this.symbol,
                        },
                        cargo: {
                            capacity: 100,
                            units: 100,
                            inventory: []
                        },
                        cooldown: {
                            remainingSeconds: 0,
                            shipSymbol: this.symbol,
                            totalSeconds: 0,
                            expiration: new Date().toISOString()
                        }
                    }
                }
                return Promise.resolve(response)
            } else {
                console.log(error.response.data)
                throw error
            }
        }
    }

    async refuel() {
        try {
            const beforeDetails = await this.queue(() => {
                return this.api.agents.getMyAgent()
            })
            const res = await this.queue(() => {
                this.log(`Refueling ship`)
                return this.api.fleet.refuelShip(this.symbol)
            })

            const cost = beforeDetails.data.data.credits - res.data.data.agent.credits

            await processAgent(res.data.data.agent)

            this.log(`New fuel ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} at cost of ${cost}`)

            return processFuel(this.symbol, res.data.data.fuel)
        } catch(error) {
            console.log("error refueling", error.response.data)
        }
    }

    async dock() {
        return this.queue(async () => {
            this.log(`Docking ship`)
            const res = await this.api.fleet.dockShip(this.symbol)

            return processNav(this.symbol, res.data.data.nav)
        })
    }

    async orbit() {
        return this.queue(async () => {
            this.log(`Orbiting ship`)
            const res = await this.api.fleet.orbitShip(this.symbol)

            return processNav(this.symbol, res.data.data.nav)
        })
    }

    async chart() {
        return this.queue(async () => {
            try {
                this.log(`Charting current position`)
                const res = await this.api.fleet.createChart(this.symbol)

                await storeWaypoint(res.data.data.waypoint)

                return returnShipData(this.symbol)
            } catch(error) {
                console.log(error.response?.data ? error.response.data : error.toString())
            }
        })
    }

    async navigateMode(mode: ShipNavFlightMode) {
        return this.queue(async () => {
            try {
                this.log(`Setting navigate mode to ${mode}`)
                const res = await this.api.fleet.patchShipNav(this.symbol, {
                    flightMode: mode
                })

                await processNav(this.symbol, res.data.data)

                return returnShipData(this.symbol)
            } catch(error) {
                console.log(error.response?.data ? error.response.data : error.toString())
            }
        })
    }

    async currentCargo() {
        const cargo = await this.queue(() => {
            return this.api.fleet.getMyShipCargo(this.symbol)
        })

        cargo.data.data.inventory.forEach(item => {
            this.log(`Cargo: ${item.symbol} x${item.units}`)
        })

        return processCargo(this.symbol, cargo.data.data)
    }

    async survey() {
        await this.waitForCooldown('reactor')

        const survey = await this.queue(() => {
            return this.api.fleet.createSurvey(this.symbol)
        })

        survey.data.data.surveys.forEach(item => {
            this.log(`Survey: ${item.signature} [${item.size}] ${item.deposits.map(d => d.symbol).join(', ')}, expires ${item.expiration}`)
        })

        const expiry = new Date(survey.data.data.cooldown.expiration)
        const waitTime = expiry.getTime() - Date.now() + 200
        this.setCooldown('reactor', waitTime)

        return processCooldown(this.symbol, survey.data.data.cooldown)
    }

    async purchaseCargo(good: string, quantity: number) {
        let shipData: any = undefined
        try {

            const result = await this.api.fleet.purchaseCargo(this.symbol, {
                symbol: good,
                units: quantity
            })
            this.log(`Purchased ${quantity} of ${good} for ${result.data.data.transaction.pricePerUnit} each. Total price ${result.data.data.transaction.totalPrice}.`)

            const shipData = await processCargo(this.symbol, result.data.data.cargo)

            return shipData
        } catch(error) {
            console.log(error.response.data)
        }

        return shipData
    }

    async sellAllCargo() {
        const cargo = await this.queue(() => {
            return this.api.fleet.getMyShipCargo(this.symbol)
        })
        const market = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))

        let shipData: any = undefined
        try {
            for(const item of cargo.data.data.inventory) {
                if (item.symbol === 'ANTIMATTER') {
                    continue;
                }
                try {
                    const tradeVolume = market.data.data.tradeGoods.find(g => g.symbol === item.symbol).tradeVolume
                    let leftToSell = item.units
                    do {
                        const result = await this.queue(() => {
                            this.log(`Selling ${item.units} of ${item.symbol}`)
                            return this.api.fleet.sellCargo(this.symbol, {
                                symbol: item.symbol,
                                units: Math.min(item.units, tradeVolume)
                            })
                        })
                        leftToSell -= Math.min(item.units, tradeVolume)
                        this.log(`Sold ${item.units} units of ${item.symbol} for ${result.data.data.transaction.pricePerUnit} each, total ${result.data.data.transaction.totalPrice}. Credits ${result.data.data.agent.credits}.`)
                        await processAgent(result.data.data.agent)
                        shipData = await processCargo(this.symbol, result.data.data.cargo)
                    } while (leftToSell > 0)
                } catch(error) {
                    console.error(`failed to sell ${item.symbol}`, error.response.data)
                }
            }
        } catch(error) {
            console.log(error.response.data)
        }

        return shipData
    }

    async scanWaypoints() {
        try {
            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                this.log(`Scanning waypoints`)
                return this.api.fleet.createShipWaypointScan(this.symbol)
            })
            fs.writeFileSync(`scanresult${res.data.data.waypoints[0].systemSymbol}`, JSON.stringify(res.data.data.waypoints, null, 2))
            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            await storeWaypointScan(res.data.data.waypoints[0].systemSymbol, res.data.data)
            const cooldown = await processCooldown(this.symbol, res.data.data.cooldown)

            return cooldown
        } catch(error) {
            console.error(error?.response?.data ? error?.response?.data : error.toString())
        }
    }

    async scanShips() {
        try {
            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                this.log(`Scanning ships`)
                return this.api.fleet.createShipShipScan(this.symbol)
            })

            this.log(`Scanned for ships, found ${res.data.data.ships.length} ships in scan range.`)

            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            await storeShipScan(res.data.data)
            const cooldown = await processCooldown(this.symbol, res.data.data.cooldown)

            return cooldown
        } catch(error) {
            console.error(error?.response?.data ? error?.response?.data : error.toString())
        }
    }

    async market() {
        const res = await this.queue(() => {
            this.log(`Retrieving market information`)
            return this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        await storeMarketInformation(res.data)

        axios.put('https://st.feba66.de/markets', res.data.data).catch(error => {
            console.log("Error loading market data to feba66", error)
        }).then(() => {
            console.log("Uploaded market data to feba66")
        })

        return res.data.data;
    }

    async shipyard() {
        const res = await this.queue(() => {
            this.log(`Retrieving shipyard information`)
            return this.api.systems.getShipyard(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        fs.writeFileSync(`dumps/shipyardInformation-${this.currentWaypointSymbol}.json`, JSON.stringify(res.data.data, null, 2))

        // axios.put('https://st.feba66.de/markets', res.data.data).catch(error => {
        //     console.log("Error loading market data to feba66", error)
        // }).then(() => {
        //     console.log("Uploaded market data to feba66")
        // })

        return res.data.data;
    }
}