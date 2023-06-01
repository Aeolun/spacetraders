import {createOrGetAgentQueue, Queue } from "@app/lib/queue";
import {logShipAction} from "@app/lib/log";
import api, {APIInstance} from "@app/lib/createApi";
import {
    processShipyard,
    storeJumpGateInformation,
    storeMarketInformation,
    storeShipScan,
    storeWaypoint,
    storeWaypointScan
} from "@app/ship/storeResults";
import fs from "fs";
import {
    ExtractResources201Response,
    ExtractResources201ResponseData, GetMarket200Response, Market, MarketTransaction,
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
import {prisma} from "@app/prisma";
import {getDistance} from "@common/lib/getDistance";
import {tradeLogic} from "@app/ship/behaviors/trade-behavior";

type CooldownKind = 'reactor'

const cooldowns: Record<CooldownKind, Record<string, Promise<any> | undefined>> = {
    reactor: {}
}

export class Ship {
    public api: APIInstance
    public queue: Queue

    public currentSystemSymbol: string
    public currentWaypointSymbol: string

    public hasWarpDrive = false
    public engineSpeed = 0

    public navigationUntil: string | undefined = undefined

    constructor(public token: string, public agent: string, public symbol: string) {
        this.api = createApi(token)
        this.queue = createOrGetAgentQueue(agent)
    }

    public setCurrentLocation(system:string, waypoint: string) {
        this.currentSystemSymbol = system
        this.currentWaypointSymbol = waypoint
    }

    public async updateShipStatus() {
        const shipInfo = await this.queue(() => this.api.fleet.getMyShip(this.symbol))

        this.currentWaypointSymbol = shipInfo.data.data.nav.waypointSymbol
        this.currentSystemSymbol = shipInfo.data.data.nav.systemSymbol

        this.navigationUntil = shipInfo.data.data.nav.status === 'IN_TRANSIT' ? shipInfo.data.data.nav.route.arrival : undefined

        this.engineSpeed = shipInfo.data.data.engine.speed
        this.hasWarpDrive = shipInfo.data.data.modules.some(m => m.symbol.includes('WARP_DRIVE'))
    }

    setTravelGoal(system: string) {
        return prisma.ship.update({
            where: {
                symbol: this.symbol
            },
            data: {
                travelGoalSystemSymbol: system
            }
        })
    }

    setOverallGoal(goal: string) {
        return prisma.ship.update({
            where: {
                symbol: this.symbol
            },
            data: {
                overalGoal: goal
            }
        })
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

    async waitUntil(time: string) {
        const arrivalTime = new Date(time)
        const waitTime = arrivalTime.getTime() - Date.now() + 200
        this.log(`Waiting ${waitTime} ms`)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, waitTime)
        })
    }

    async waitFor(time: number) {
        this.log(`Waiting ${time} ms`)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time)
        })
    }

    async navigate(waypoint: string, waitForTimeout = true) {
        try {
            if (this.navigationUntil) {
                this.log('Ship still navigating, waiting until completion')
                await this.waitUntil(this.navigationUntil)
            }

            const res = await this.queue(() => {
                this.log(`Navigating ship to ${waypoint}`)
                return this.api.fleet.navigateShip(this.symbol, {
                    waypointSymbol: waypoint
                })
            })
            const nowAfterNav = Date.now()

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Navigating from ${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed.amount} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`)

            try {
                await prisma.travelLog.create({
                    data: {
                        shipSymbol: this.symbol,
                        fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
                        toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
                        fromWaypoint: res.data.data.nav.route.departure.symbol,
                        toWaypoint: res.data.data.nav.route.destination.symbol,
                        method: 'navigate',
                        engineSpeed: this.engineSpeed,
                        fuelConsumed: res.data.data.fuel.consumed.amount,
                        flightMode: res.data.data.nav.flightMode,
                        distance: Math.round(getDistance(res.data.data.nav.route.departure, res.data.data.nav.route.destination)),
                        cooldown: 0,
                        flightDuration: new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav
                    }
                })
            } catch(error) {
                console.error("Could not log travel", error)
            }

            await processFuel(this.symbol, res.data.data.fuel);
            const navResult = await processNav(this.symbol, res.data.data.nav)

            if (waitForTimeout) {
                await this.waitUntil(res.data.data.nav.route.arrival)
                return navResult
            } else {
                return navResult
            }
        } catch(error) {
            if (error.response?.data?.error?.code === 4204) {
                this.log(`Already at ${waypoint}`)
                return;
            } else {
                console.error(`issue in navigate for ${this.symbol}`, error.response.data)
                throw error
            }
        }
    }

    async warp(waypoint: string, waitForTimeout = true) {
        try {
            if (this.navigationUntil) {
                this.log('Ship still navigating, waiting until completion')
                await this.waitUntil(this.navigationUntil)
            }

            const res = await this.queue(() => {
                this.log(`Warping ship from ${this.currentSystemSymbol} to ${waypoint}`)
                return this.api.fleet.warpShip(this.symbol, {
                    waypointSymbol: waypoint
                })
            })
            const nowAfterNav = Date.now()

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Navigating from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed.amount} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`)

            await processFuel(this.symbol, res.data.data.fuel);
            const navResult = await processNav(this.symbol, res.data.data.nav)

            try {
                const departureSystem = await prisma.system.findFirst({
                    where: {
                        symbol: res.data.data.nav.route.departure.systemSymbol
                    }
                })
                const destinationSystem = await prisma.system.findFirst({
                    where: {
                        symbol: res.data.data.nav.route.destination.systemSymbol
                    }
                })

                await prisma.travelLog.create({
                    data: {
                        shipSymbol: this.symbol,
                        fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
                        toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
                        fromWaypoint: res.data.data.nav.route.departure.symbol,
                        toWaypoint: res.data.data.nav.route.destination.symbol,
                        method: 'warp',
                        engineSpeed: this.engineSpeed,
                        fuelConsumed: res.data.data.fuel.consumed.amount,
                        flightMode: res.data.data.nav.flightMode,
                        distance: Math.round(getDistance(departureSystem, destinationSystem)),
                        cooldown: 0,
                        flightDuration: new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav
                    }
                })
            } catch(error) {
                console.error("Could not log travel", error)
            }

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
                console.error(`issue in warp for ${this.symbol}`, error.response.data)
                throw error
            }
        }
    }

    async jump(system: string, waitForTimeout = true) {
        try {
            if (this.navigationUntil) {
                this.log('Ship still navigating, waiting until completion')
                await this.waitUntil(this.navigationUntil)
            }

            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                this.log(`Jumping ship from ${this.currentSystemSymbol} to ${system}`)
                return this.api.fleet.jumpShip(this.symbol, {
                    systemSymbol: system
                })
            })
            const nowAfterNav = Date.now()

            this.currentSystemSymbol = res.data.data.nav.route.destination.systemSymbol;
            this.currentWaypointSymbol = res.data.data.nav.route.destination.symbol

            this.log(`Jumping from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol}`)

            const navResult = await processNav(this.symbol, res.data.data.nav)

            await processCooldown(this.symbol, res.data.data.cooldown)

            const expiry = new Date(res.data.data.cooldown.expiration)
            const waitTime = expiry.getTime() - Date.now() + 200
            this.setCooldown('reactor', waitTime)

            try {
                const departureSystem = await prisma.system.findFirst({
                    where: {
                        symbol: res.data.data.nav.route.departure.systemSymbol
                    }
                })
                const destinationSystem = await prisma.system.findFirst({
                    where: {
                        symbol: res.data.data.nav.route.destination.systemSymbol
                    }
                })

                await prisma.travelLog.create({
                    data: {
                        shipSymbol: this.symbol,
                        fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
                        toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
                        fromWaypoint: res.data.data.nav.route.departure.symbol,
                        toWaypoint: res.data.data.nav.route.destination.symbol,
                        method: 'jump',
                        engineSpeed: this.engineSpeed,
                        fuelConsumed: 0,
                        flightMode: ShipNavFlightMode.Cruise,
                        distance: Math.round(getDistance(departureSystem, destinationSystem)),
                        cooldown: expiry.getTime() - Date.now(),
                        flightDuration: new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav
                    }
                })
            } catch(error) {
                console.error("Could not log travel", error)
            }

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
                console.error(`issue in jump for ${this.symbol}`, error.response.data)
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

            return {
                ship: newShipInfo,
                extract: res.data
            };
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
                return Promise.resolve({
                    ship: null,
                    extract: response
                })
            } else {
                console.log(`error during extract for ${this.symbol}`, error.response?.data ? error.response.data : error)
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
            this.log(`error refueling at ${this.currentWaypointSymbol}`)
            console.log(error.response?.data ? error.response.data : error)
        }
    }

    async dock() {
        return this.queue(async () => {
            this.log(`Docking ship`)
            try {
                const res = await this.api.fleet.dockShip(this.symbol)

                return processNav(this.symbol, res.data.data.nav)
            } catch(error) {
                console.log(`error docking for ${this.symbol}`, error.response?.data ? error.response.data : error.toString())
            }
        })
    }

    async orbit() {
        return this.queue(async () => {
            this.log(`Orbiting ship`)
            const res = await this.api.fleet.orbitShip(this.symbol)

            return processNav(this.symbol, res.data.data.nav)
        })
    }

    async contract() {
        try {
            const result = await this.queue(async () => {
                this.log(`Negotiating contract`)
                const res = await this.api.fleet.negotiateContract(this.symbol)

                fs.writeFileSync('./dumps/contract.json', JSON.stringify(res.data.data.contract, null, 2))
            })
            return result
        }catch(error) {
            console.log(`error docking for ${this.symbol}`, error.response?.data ? error.response.data : error.toString())
        }
    }

    async chart() {
        try {
            this.log(`Charting current position`)

            let waypointData
            try {
                const res = await this.queue(async () => this.api.fleet.createChart(this.symbol))
                res.data.data.waypoint.chart = res.data.data.waypoint.chart ?? res.data.data.chart
                waypointData = res.data.data.waypoint
            } catch(error) {
                console.log("error during chart, updating waypoint information", error.response?.data ? error.response.data : error.toString())
                await this.updateShipStatus()
                const waypointInfo = await this.queue(async () => this.api.systems.getWaypoint(this.currentSystemSymbol, this.currentWaypointSymbol))
                waypointData = waypointInfo.data.data
            }
            const waypoint = await storeWaypoint(waypointData)
            const shipData = await returnShipData(this.symbol)

            return {
                ship: shipData,
                waypoint: waypoint
            }
        } catch(error) {
            console.log(`error in chart for ${this.symbol}`, error.response?.data ? error.response.data : error)
            throw error
        }
    }

    async navigateMode(mode: ShipNavFlightMode) {
        try {
            this.log(`Setting navigate mode to ${mode}`)
            const res = await this.queue(async () =>this.api.fleet.patchShipNav(this.symbol, {
                flightMode: mode
            }))

            await processNav(this.symbol, res.data.data)

            return returnShipData(this.symbol)
        } catch(error) {
            console.log(`error in navigatemode for ${this.symbol}`, error.response?.data ? error.response.data : error)
        }
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

        const ship = processCooldown(this.symbol, survey.data.data.cooldown)

        return {
            ship: ship,
            survey: survey
        }
    }

    async yeet(good: string, quantity: number) {
        try {
            const result = await this.queue(() => this.api.fleet.jettison(this.symbol, {
                units: quantity,
                symbol: good
            }))
            this.log(`Jettisoned ${quantity} ${good}`)
            return result
        } catch(error) {
            console.log("Issue during yeeting")
        }
    }

    async purchaseCargo(good: string, quantity: number) {
        let shipData: any = undefined
        try {
            const marketBefore = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))
            const boughtGoodBefore = marketBefore.data.data.tradeGoods.find(g => g.symbol === good)
            const result = await this.queue(() => this.api.fleet.purchaseCargo(this.symbol, {
                symbol: good,
                units: quantity
            }))
            const marketAfter = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))
            const boughtGood = marketAfter.data.data.tradeGoods.find(g => g.symbol === good)
            this.log(`Purchased ${quantity} of ${good} for ${result.data.data.transaction.pricePerUnit} each. Total price ${result.data.data.transaction.totalPrice}.`)
            await prisma.tradeLog.create({
                data: {
                    shipSymbol: this.symbol,
                    waypointSymbol: result.data.data.transaction.waypointSymbol,
                    tradeGoodSymbol: result.data.data.transaction.tradeSymbol,
                    purchasePrice: result.data.data.transaction.pricePerUnit,
                    purchaseAmount: result.data.data.transaction.units,
                    purchaseVolume: boughtGood.tradeVolume,
                    purchasePriceAfter: boughtGood.purchasePrice,
                    tradeVolume: boughtGoodBefore.tradeVolume,
                    supply: boughtGoodBefore.supply,
                    supplyAfter: boughtGood.supply
                }
            })

            await storeMarketInformation(marketAfter.data)
            await processCargo(this.symbol, result.data.data.cargo)

            return result.data.data.transaction
        } catch(error) {
            console.log(`error during purchase cargo for ${this.symbol}`, error.response?.data ? error.response.data : error)
        }
    }

    async sellCargo(tradeGoodSymbol: string, units: number, market?: GetMarket200Response) {
        if (!market) {
            const axiosData = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))
            market = axiosData.data
        }
        try {
            const good = market.data.tradeGoods.find(g => g.symbol === tradeGoodSymbol)
            if (!good) {
                throw new Error(`Cannot sell ${tradeGoodSymbol} here`)
            }

            const tradeVolume = good?.tradeVolume

            const soldGoodBefore = market.data.tradeGoods.find(g => g.symbol === tradeGoodSymbol)
            let leftToSell = units
            do {
                const result = await this.queue(() => {
                    this.log(`Selling ${units} of ${tradeGoodSymbol}`)
                    return this.api.fleet.sellCargo(this.symbol, {
                        symbol: tradeGoodSymbol,
                        units: Math.min(units, tradeVolume)
                    })
                })
                leftToSell -= Math.min(units, tradeVolume)
                const marketAfter = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))
                const soldGood = marketAfter.data.data.tradeGoods.find(g => g.symbol === tradeGoodSymbol)
                await prisma.tradeLog.create({
                    data: {
                        shipSymbol: this.symbol,
                        waypointSymbol: result.data.data.transaction.waypointSymbol,
                        tradeGoodSymbol: result.data.data.transaction.tradeSymbol,
                        sellPrice: result.data.data.transaction.pricePerUnit,
                        sellAmount: result.data.data.transaction.units,
                        sellVolume: good.tradeVolume,
                        sellPriceAfter: soldGood.sellPrice,
                        tradeVolume: soldGoodBefore.tradeVolume,
                        supply: soldGoodBefore.supply,
                        supplyAfter: soldGood.supply,
                    }
                })
                this.log(`Sold ${Math.min(units, tradeVolume)} units of ${tradeGoodSymbol} for ${result.data.data.transaction.pricePerUnit} each, total ${result.data.data.transaction.totalPrice}. Credits ${result.data.data.agent.credits}.`)
                await storeMarketInformation(marketAfter.data)
                await processAgent(result.data.data.agent)
                await processCargo(this.symbol, result.data.data.cargo)

                return result.data.data.transaction
            } while (leftToSell > 0)
        } catch(error) {
            console.error(`failed to sell ${tradeGoodSymbol}`, error.response?.data ? error.response.data : error)
            throw error
        }
    }

    async attemptRefuel() {
        const fuelHere = await prisma.marketPrice.findFirst({
            where: {
                waypointSymbol: this.currentWaypointSymbol,
                tradeGoodSymbol: "FUEL"
            }
        })
        if (fuelHere) {
            const ship = await prisma.ship.findFirst({
                where: {
                    symbol: this.symbol
                }
            })
            if (ship.fuelAvailable < ship.fuelCapacity / 2) {
                await this.refuel()
            }
        }
    }

    async sellAllCargo() {
        this.log("Selling all cargo")
        const cargo = await this.queue(() => {
            return this.api.fleet.getMyShipCargo(this.symbol)
        })
        const market = await this.queue(() => this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol))

        let transactions: MarketTransaction[] = []
        try {

            for(const item of cargo.data.data.inventory) {
                if (item.symbol === 'ANTIMATTER') {
                    continue;
                }
                transactions.push(await this.sellCargo(item.symbol, item.units, market.data))
            }
        } catch(error) {
            console.log(`error while selling goods for ${this.symbol}`, error.response?.data ? error.response.data : error)
        }

        return transactions
    }

    async scanWaypoints() {
        try {
            await this.waitForCooldown('reactor')

            const res = await this.queue(() => {
                this.log(`Scanning waypoints`)
                return this.api.fleet.createShipWaypointScan(this.symbol)
            })
            fs.writeFileSync(`dumps/scanresult${res.data.data.waypoints[0].systemSymbol}.json`, JSON.stringify(res.data.data.waypoints, null, 2))
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
            console.error(`error scanning ships for ${this.symbol}`, error?.response?.data ? error?.response?.data : error)
        }
    }

    async market() {
        const res = await this.queue(() => {
            this.log(`Retrieving market information`)
            return this.api.systems.getMarket(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        await storeMarketInformation(res.data)

        // axios.put('https://st.feba66.de/prices', res.data.data.tradeGoods).catch(error => {
        //     console.log("Error loading market data to feba66", error)
        // }).then(() => {
        //     console.log("Uploaded market data to feba66")
        // })

        return res.data.data;
    }

    async jumpgate() {
        const res = await this.queue(() => {
            this.log(`Retrieving jumpgate information`)
            return this.api.systems.getJumpGate(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        await storeJumpGateInformation(this.currentWaypointSymbol, res.data)

        return res.data.data;
    }

    async shipyard() {
        const res = await this.queue(() => {
            this.log(`Retrieving shipyard information`)
            return this.api.systems.getShipyard(this.currentSystemSymbol, this.currentWaypointSymbol)
        })

        await processShipyard(res.data.data)

        fs.writeFileSync(`dumps/shipyardInformation-${this.currentWaypointSymbol}.json`, JSON.stringify(res.data.data, null, 2))

        // axios.put('https://st.feba66.de/markets', res.data.data).catch(error => {
        //     console.log("Error loading market data to feba66", error)
        // }).then(() => {
        //     console.log("Uploaded market data to feba66")
        // })

        return res.data.data;
    }
}