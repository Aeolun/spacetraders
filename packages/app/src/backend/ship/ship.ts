import {throttle} from "@app/lib/queue";
import {logShipAction} from "@app/lib/log";
import api from "@app/lib/apis";
import {storeShipScan, storeWaypoint, storeWaypointScan} from "@app/ship/storeResults";
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

type CooldownKind = 'reactor'

const cooldowns: Record<CooldownKind, Record<string, Promise<any> | undefined>> = {
    reactor: {}
}

export class Ship {
    private currentSystemSymbol: string
    private currentWaypointSymbol: string

    constructor(public symbol: string) {}

    public setCurrentLocation(system:string, waypoint: string) {
        this.currentSystemSymbol = system
        this.currentWaypointSymbol = waypoint
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
        const res = await throttle(() => {
            this.log(`Retrieving cooldowns, to wait for existing ones.`)
            return api.fleet.getShipCooldown(this.symbol)
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
            const res = await throttle(() => {
                this.log(`Navigating ship to ${waypoint}`)
                return api.fleet.navigateShip(this.symbol, {
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
            const res = await throttle(() => {
                this.log(`Navigating ship to ${waypoint}`)
                return api.fleet.warpShip(this.symbol, {
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

    async extract(survey?: Survey) {
        try {
            await this.waitForCooldown('reactor')

            const res = await throttle(() => {
                const fromDeposit = survey ? ` from deposit ${survey.signature}` : ''
                this.log(`Extracting resources${fromDeposit}`)
                return api.fleet.extractResources(this.symbol, {
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
            const beforeDetails = await throttle(() => {
                return api.agents.getMyAgent()
            })
            const res = await throttle(() => {
                this.log(`Refueling ship`)
                return api.fleet.refuelShip(this.symbol)
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
        return throttle(async () => {
            this.log(`Docking ship`)
            const res = await api.fleet.dockShip(this.symbol)

            return processNav(this.symbol, res.data.data.nav)
        })
    }

    async orbit() {
        return throttle(async () => {
            this.log(`Orbiting ship`)
            const res = await api.fleet.orbitShip(this.symbol)

            return processNav(this.symbol, res.data.data.nav)
        })
    }

    async chart() {
        return throttle(async () => {
            try {
                this.log(`Charting current position`)
                const res = await api.fleet.createChart(this.symbol)

                await storeWaypoint(res.data.data.waypoint)

                return returnShipData(this.symbol)
            } catch(error) {
                console.log(error.response?.data ? error.response.data : error.toString())
            }
        })
    }

    async navigateMode(mode: ShipNavFlightMode) {
        return throttle(async () => {
            try {
                this.log(`Setting navigate mode to ${mode}`)
                const res = await api.fleet.patchShipNav(this.symbol, {
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
        const cargo = await throttle(() => {
            return api.fleet.getMyShipCargo(this.symbol)
        })

        cargo.data.data.inventory.forEach(item => {
            this.log(`Cargo: ${item.symbol} x${item.units}`)
        })

        return processCargo(this.symbol, cargo.data.data)
    }

    async survey() {
        await this.waitForCooldown('reactor')

        const survey = await throttle(() => {
            return api.fleet.createSurvey(this.symbol)
        })

        survey.data.data.surveys.forEach(item => {
            this.log(`Survey: ${item.signature} [${item.size}] ${item.deposits.map(d => d.symbol).join(', ')}, expires ${item.expiration}`)
        })

        const expiry = new Date(survey.data.data.cooldown.expiration)
        const waitTime = expiry.getTime() - Date.now() + 200
        this.setCooldown('reactor', waitTime)

        return processCooldown(this.symbol, survey.data.data.cooldown)
    }



    async sellAllCargo() {
        const cargo = await throttle(() => {
            return api.fleet.getMyShipCargo(this.symbol)
        })

        let shipData: any = undefined
        try {
            for(const item of cargo.data.data.inventory) {
                if (item.symbol === 'ANTIMATTER') {
                    continue;
                }
                try {
                    const result = await throttle(() => {
                        this.log(`Selling ${item.units} of ${item.symbol}`)
                        return api.fleet.sellCargo(this.symbol, {
                            symbol: item.symbol,
                            units: item.units
                        })
                    })
                    this.log(`Sold ${item.units} units of ${item.symbol} for ${result.data.data.transaction.pricePerUnit} each, total ${result.data.data.transaction.totalPrice}. Credits ${result.data.data.agent.credits}.`)
                    await processAgent(result.data.data.agent)
                    shipData = await processCargo(this.symbol, result.data.data.cargo)
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

            const res = await throttle(() => {
                this.log(`Scanning waypoints`)
                return api.fleet.createShipWaypointScan(this.symbol)
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

            const res = await throttle(() => {
                this.log(`Scanning ships`)
                return api.fleet.createShipShipScan(this.symbol)
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
        const res = await throttle(() => {
            this.log(`Retrieving market information`)
            return api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        fs.writeFileSync(`marketInformation-${this.currentWaypointSymbol}.json`, JSON.stringify(res.data.data, null, 2))

        axios.put('https://st.feba66.de/markets', res.data.data).catch(error => {
            console.log("Error loading market data to feba66", error)
        }).then(() => {
            console.log("Uploaded market data to feba66")
        })



        return res.data.data;
    }
}