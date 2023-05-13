import {throttle} from "@app/lib/queue";
import {logShipAction} from "@app/lib/log";
import api from "@app/lib/apis";
import {storeWaypointScan} from "@app/ship/storeResults";
import fs from "fs";
import {ExtractResources201Response, ExtractResources201ResponseData, Survey} from "spacetraders-sdk";
import {processNav} from "@app/ship/updateShips";

type CooldownKind = 'reactor'

const cooldowns: Record<CooldownKind, Record<string, Promise<any> | undefined>> = {
    reactor: {}
}

export class Ship {
    private currentSystemSymbol: string
    private currentWaypointSymbol: string

    constructor(public symbol: string) {}

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

            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            return res.data;
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
        const beforeDetails = await throttle(() => {
            return api.agents.getMyAgent()
        })
        const res = await throttle(() => {
            this.log(`Refueling ship`)
            return api.fleet.refuelShip(this.symbol)
        })

        const cost = beforeDetails.data.data.credits - res.data.data.agent.credits

        this.log(`New fuel ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} at cost of ${cost}`)
    }

    async dock() {
        return throttle(() => {
            this.log(`Docking ship`)
            return api.fleet.dockShip(this.symbol)
        })
    }

    async orbit() {
        return throttle(() => {
            this.log(`Orbiting ship`)
            return api.fleet.orbitShip(this.symbol)
        })
    }

    async currentCargo() {
        const cargo = await throttle(() => {
            return api.fleet.getMyShipCargo(this.symbol)
        })

        cargo.data.data.inventory.forEach(item => {
            this.log(`Cargo: ${item.symbol} x${item.units}`)
        })
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

        return survey
    }

    async sellAllCargo() {
        const cargo = await throttle(() => {
            return api.fleet.getMyShipCargo(this.symbol)
        })

        try {
            for(const item of cargo.data.data.inventory) {
                if (item.symbol === 'ANTIMATTER') {
                    continue;
                }
                const result = await throttle(() => {
                    this.log(`Selling ${item.units} of ${item.symbol}`)
                    return api.fleet.sellCargo(this.symbol, {
                        symbol: item.symbol,
                        units: item.units
                    })
                })
                this.log(`Sold ${item.units} units of ${item.symbol} for ${result.data.data.transaction.pricePerUnit} each, total ${result.data.data.transaction.totalPrice}. Credits ${result.data.data.agent.credits}.`)
            }
        } catch(error) {
            console.log(error.response.data)
        }

        return cargo
    }

    async scanWaypoints() {
        await this.waitForCooldown('reactor')

        const res = await throttle(() => {
            this.log(`Scanning waypoints`)
            return api.fleet.createShipWaypointScan(this.symbol)
        })

        const expiry = new Date(res.data.data.cooldown.expiration)
        const waitTime = expiry.getTime() - Date.now() + 200
        this.setCooldown('reactor', waitTime)

        await storeWaypointScan(res.data.data)

        return res
    }

    async market() {
        const res = await throttle(() => {
            this.log(`Retrieving market information`)
            return api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        fs.writeFileSync(`marketInformation-${this.currentWaypointSymbol}.json`, JSON.stringify(res.data.data, null, 2))
    }
}