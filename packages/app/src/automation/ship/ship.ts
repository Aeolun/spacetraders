import {foregroundQueue, Queue} from "@auto/lib/queue";
import { logShipAction } from "@auto/lib/log";
import api, { APIInstance } from "@common/lib/createApi";
import fs from "fs";
import {
  ExtractResources201Response,
  ExtractResources201ResponseData,
  GetMarket200Response,
  Market,
  MarketTransaction, ShipCargoItem,
  ShipNavFlightMode,
  ShipRefineRequestProduceEnum, ShipType,
  Survey,
  TradeSymbol,
} from "spacetraders-sdk";
import {
  returnShipData,
} from "@auto/ship/updateShips";
import { prisma, System, TaskType, Waypoint } from "@common/prisma";
import { getDistance } from "@common/lib/getDistance";
import { ee } from "@auto/event-emitter";
import {storeWaypointScan} from "@common/lib/data-update/store-waypoint-scan";
import {storeWaypoint} from "@common/lib/data-update/store-waypoint";
import {storeJumpGateInformation} from "@common/lib/data-update/store-jump-gate";
import {storeMarketInformation} from "@common/lib/data-update/store-market-information";
import {processShipyard} from "@common/lib/data-update/store-shipyard";
import {storeShipScan} from "@common/lib/data-update/store-ship-scan";
import {processShip} from "@common/lib/data-update/store-ship";
import {processNav} from "@common/lib/data-update/store-ship-nav";
import {processFuel} from "@common/lib/data-update/store-ship-fuel";
import {processAgent} from "@common/lib/data-update/store-agent";
import {processCooldown} from "@common/lib/data-update/store-cooldown";
import {processCargo} from "@common/lib/data-update/store-ship-cargo";
import {Objective} from "@auto/strategy/objective/objective";
import {isAxiosApiErrorResponse} from "@common/lib/is-api-error";
import {AxiosError} from "axios";
import {Task} from "@auto/ship/task/task";
import {TravelTask} from "@auto/ship/task/travel";
import {deserializeTask} from "@auto/ship/task/deserialize-task";
import {processConstruction} from "@common/lib/data-update/store-construction";

type CooldownKind = "reactor";

const cooldowns: Record<
  CooldownKind,
  Record<string, Promise<any> | undefined>
> = {
  reactor: {},
};

export class Ship {
  private queue: Queue;
  private taskQueue: {id: string; task: Task}[] = [];

  public _currentSystemSymbol?: string;
  private _currentSystemObject?: System;
  public _currentWaypointSymbol?: string;
  private _currentWaypointObject?: Waypoint;

  public hasWarpDrive = false;
  public engineSpeed = 0;
  public navMode: ShipNavFlightMode = ShipNavFlightMode.Cruise;

  public fuel = 0;
  public maxFuel = 0;

  public cargo = 0;
  public maxCargo = 0;
  public currentCargo: Record<string, number> = {}

  public navigationUntil: string | undefined = undefined;
  public isDocked = false;

  public expectedCargo: Record<string, number> = {};

  constructor(public symbol: string, private api: APIInstance) {
    this.queue = foregroundQueue;
  }

  public hasMoreThanExpectedCargo() {
    return Object.keys(this.currentCargo).some((key) => {
      return this.currentCargo[key] > (this.expectedCargo[key] ?? 0);
    });
  }

  async addTask(task: Task) {
    const taskEntity = await prisma.shipTask.create({
      data: {
        shipSymbol: this.symbol,
        data: task.serialize(),
        type: task.type
      }
    })
    this.taskQueue.push({
      id: taskEntity.id,
      task: task
    });
  }

  async clearTaskQueue() {
    await prisma.shipTask.deleteMany({
      where: {
        shipSymbol: this.symbol
      }
    })
    this.taskQueue = []
  }

  get taskQueueLength() {
    return this.taskQueue.length
  }

  async getNextTask() {
    const nextTask = this.taskQueue[0]
    if (nextTask === undefined) {
      return undefined
    }
    return nextTask?.task
  }
  async finishedTask() {
    const nextTask = this.taskQueue.shift()
    if (nextTask === undefined) {
      throw new Error("Should never remove a nonexistent task.")
    }
    await prisma.shipTask.deleteMany({
      where: {
        id: nextTask.id
      }
    })
  }

  async loadTaskQueue() {
    const tasks = await prisma.shipTask.findMany({
      where: {
        shipSymbol: this.symbol
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    this.taskQueue = tasks.map((t) => {
      return {
        id: t.id,
        task: deserializeTask(t)
      }
    })
  }

  get currentSystemSymbol(): string {
    if (!this._currentSystemSymbol) {
      throw new Error("No current system symbol");
    }
    return this._currentSystemSymbol;
  }

  get currentWaypointSymbol(): string {
    if (!this._currentWaypointSymbol) {
      throw new Error("No current waypoint symbol");
    }
    return this._currentWaypointSymbol;
  }

  public setCurrentLocation(system: string, waypoint: string) {
    this._currentSystemSymbol = system;
    this._currentWaypointSymbol = waypoint;
  }

  public async updateShipStatus() {
    const shipInfo = await this.queue(() =>
      this.api.fleet.getMyShip(this.symbol)
    );
    await processShip(shipInfo.data.data);

    this._currentWaypointSymbol = shipInfo.data.data.nav.waypointSymbol;
    this._currentSystemSymbol = shipInfo.data.data.nav.systemSymbol;
    await this.updateLocationObjects()

    this.navigationUntil =
      shipInfo.data.data.nav.status === "IN_TRANSIT"
        ? shipInfo.data.data.nav.route.arrival
        : undefined;
    this.navMode = shipInfo.data.data.nav.flightMode;

    this.cargo = shipInfo.data.data.cargo.units;
    this.maxCargo = shipInfo.data.data.cargo.capacity;
    this.updateInventory(shipInfo.data.data.cargo.inventory);

    this.fuel = shipInfo.data.data.fuel.current;
    this.maxFuel = shipInfo.data.data.fuel.capacity;

    this.engineSpeed = shipInfo.data.data.engine.speed;
    this.hasWarpDrive = shipInfo.data.data.modules.some((m) =>
      m.symbol.includes("WARP_DRIVE")
    );

    this.isDocked = shipInfo.data.data.nav.status === "DOCKED";

    await this.loadTaskQueue();
  }

  private updateInventory(inventory: ShipCargoItem[]) {
    this.currentCargo = inventory.reduce((acc, cur) => {
      acc[cur.symbol] = cur.units
      return acc
    }, {} as Record<string, number>)
  }

  get currentSystem(): System {
    if (!this._currentSystemObject) {
      throw new Error("No current system object");
    }
    return this._currentSystemObject;
  }

  get currentWaypoint(): Waypoint {
    if (!this._currentWaypointObject) {
      throw new Error("No current waypoint object");
    }
    return this._currentWaypointObject;
  }

  private async updateLocationObjects() {
    this._currentSystemObject = await prisma.system.findFirstOrThrow({
      where: {
        symbol: this.currentSystemSymbol,
      },
    });
    this._currentWaypointObject = await prisma.waypoint.findFirstOrThrow({
      where: {
        symbol: this.currentWaypointSymbol,
      },
    });
  }

  setTravelGoal(system: string) {
    return prisma.ship.update({
      where: {
        symbol: this.symbol,
      },
      data: {
        travelGoalSystemSymbol: system,
      },
    });
  }

  setOverallGoal(goal: string) {
    return prisma.ship.update({
      where: {
        symbol: this.symbol,
      },
      data: {
        overalGoal: goal,
      },
    });
  }

  log(message: string) {
    logShipAction(this.symbol, message);
  }

  private setCooldown(kind: CooldownKind, waitTime: number) {
    this.log(`Set ${kind} cooldown to expire in ${waitTime} ms`);
    cooldowns[kind][this.symbol] = new Promise((resolve, reject) => {
      setTimeout(() => {
        delete cooldowns[kind][this.symbol];
        resolve(true);
      }, waitTime);
    });
  }

  private async waitForCooldown(kind: CooldownKind) {
    if (cooldowns[kind][this.symbol]) {
      this.log(`Waiting for ${kind} cooldown to expire`);
      await cooldowns[kind][this.symbol];
    }
  }

  async validateCooldowns() {
    const res = await this.queue(() => {
      this.log(`Retrieving cooldowns, to wait for existing ones.`);
      return this.api.fleet.getShipCooldown(this.symbol);
    });

    if (res.status === 204) {
      return true;
    } else if(res.data.data.expiration) {
      const expire = new Date(res.data.data.expiration);
      const timeRemaining = expire.getTime() - Date.now() + 200;
      this.setCooldown("reactor", timeRemaining);
      await this.waitForCooldown("reactor");
    }
  }

  async waitUntil(time: string) {
    const arrivalTime = new Date(time);
    const waitTime = arrivalTime.getTime() - Date.now() + 200;
    this.log(`Waiting ${waitTime} ms`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, waitTime);
    });
  }

  async waitFor(time: number, reason?: string) {
    this.log(`Waiting ${time} ms${reason ? `, ${reason}` : ""}`);
    this.setOverallGoal(`Waiting ${time} ms${reason ? `, ${reason}` : ""}`)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }

  async getSystemWaypoints(symbol: string) {
    const result = await this.queue(() => this.api.systems.getSystemWaypoints(symbol, 1, 20))
    result.data.data.forEach((wp) => {
      storeWaypoint(wp);
    });
    return result.data.data
  }

  async navigate(waypoint: string, waitForTimeout = true) {
    try {
      if (this.navigationUntil) {
        this.log("Ship still navigating, waiting until completion");
        await this.waitUntil(this.navigationUntil);
      }

      if (this.isDocked) {
        await this.orbit();
      }

      const res = await this.queue(() => {
        this.log(`Navigating ship to ${waypoint}`);
        return this.api.fleet.navigateShip(this.symbol, {
          waypointSymbol: waypoint,
        });
      });
      const nowAfterNav = Date.now();

      this._currentSystemSymbol =
        res.data.data.nav.route.destination.systemSymbol;
      this._currentWaypointSymbol = res.data.data.nav.route.destination.symbol;
      await this.updateLocationObjects();

      this.fuel = res.data.data.fuel.current;
      this.maxFuel = res.data.data.fuel.capacity;

      this.log(
        `Navigating from ${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed?.amount ?? '??'} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`
      );

      try {
        await prisma.travelLog.create({
          data: {
            shipSymbol: this.symbol,
            fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
            toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
            fromWaypoint: res.data.data.nav.route.departure.symbol,
            toWaypoint: res.data.data.nav.route.destination.symbol,
            method: "navigate",
            engineSpeed: this.engineSpeed,
            fuelConsumed: res.data.data.fuel.consumed?.amount ?? 0,
            flightMode: res.data.data.nav.flightMode,
            distance: Math.round(
              getDistance(
                res.data.data.nav.route.departure,
                res.data.data.nav.route.destination
              )
            ),
            cooldown: 0,
            flightDuration:
              new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav,
          },
        });
      } catch (error) {
        console.error("Could not log travel", error);
      }

      await processFuel(this.symbol, res.data.data.fuel);
      const navResult = await processNav(this.symbol, res.data.data.nav);

      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });

      if (waitForTimeout) {
        await this.waitUntil(res.data.data.nav.route.arrival);
        return navResult;
      } else {
        return navResult;
      }
    } catch (error) {
      if (isAxiosApiErrorResponse(error)) {
        if (error.response?.data?.error?.code === 4203 && this.fuel > 1) {
          this.log(`Insufficient fuel for ${this.navMode} navigation to ${waypoint}. Switching to drift mode.`)
          await this.navigateMode("DRIFT");
          return this.navigate(waypoint, waitForTimeout);
        } else if (error.response?.data?.error?.code === 4204) {
          this.log(`Already at ${waypoint}`);
          return;
        }
      } else if (error instanceof AxiosError) {
        console.error(
          `issue in navigate for ${this.symbol}`,
          error.response?.data
        );
        throw error;
      } else {
        throw error;
      }
    }
  }

  async warp(waypoint: string, waitForTimeout = true) {
    try {
      if (this.navigationUntil) {
        this.log("Ship still navigating, waiting until completion");
        await this.waitUntil(this.navigationUntil);
      }

      if (this.isDocked) {
        await this.orbit();
      }

      const res = await this.queue(() => {
        this.log(
          `Warping ship from ${this.currentSystemSymbol} to ${waypoint}`
        );
        return this.api.fleet.warpShip(this.symbol, {
          waypointSymbol: waypoint,
        });
      });
      const nowAfterNav = Date.now();

      this._currentSystemSymbol =
        res.data.data.nav.route.destination.systemSymbol;
      this._currentWaypointSymbol = res.data.data.nav.route.destination.symbol;
      await this.updateLocationObjects();

      this.fuel = res.data.data.fuel.current;
      this.maxFuel = res.data.data.fuel.capacity;

      this.log(
        `Navigating from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol} cost ${res.data.data.fuel.consumed?.amount ?? '??'} fuel, have ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} left`
      );

      await processFuel(this.symbol, res.data.data.fuel);
      const navResult = await processNav(this.symbol, res.data.data.nav);

      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });

      try {
        const departureSystem = await prisma.system.findFirstOrThrow({
          where: {
            symbol: res.data.data.nav.route.departure.systemSymbol,
          },
        });
        const destinationSystem = await prisma.system.findFirstOrThrow({
          where: {
            symbol: res.data.data.nav.route.destination.systemSymbol,
          },
        });

        await prisma.travelLog.create({
          data: {
            shipSymbol: this.symbol,
            fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
            toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
            fromWaypoint: res.data.data.nav.route.departure.symbol,
            toWaypoint: res.data.data.nav.route.destination.symbol,
            method: "warp",
            engineSpeed: this.engineSpeed,
            fuelConsumed: res.data.data.fuel.consumed?.amount ?? 0,
            flightMode: res.data.data.nav.flightMode,
            distance: Math.round(
              getDistance(departureSystem, destinationSystem)
            ),
            cooldown: 0,
            flightDuration:
              new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav,
          },
        });
      } catch (error) {
        console.error("Could not log travel", error);
      }

      if (waitForTimeout) {
        const arrivalTime = new Date(res.data.data.nav.route.arrival);
        const waitTime = arrivalTime.getTime() - Date.now() + 200;
        this.log(`Waiting ${waitTime} ms until arrival`);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(navResult);
          }, waitTime);
        });
      } else {
        return navResult;
      }
    } catch (error) {
      if (isAxiosApiErrorResponse(error)) {
        if (error.response?.data?.error?.code === 4203) {
          await this.navigateMode("DRIFT");
          await this.warp(waypoint, waitForTimeout);
        } else if (error.response?.data?.error?.code === 4204) {
          this.log(`Already at ${waypoint}`);
          return;
        } else {
          console.error(`issue in warp for ${this.symbol}`, error.response?.data);
          throw error;
        }
      }
      throw error;
    }
  }

  async jump(waypointSymbol: string, waitForTimeout = true) {
    try {
      if (this.navigationUntil) {
        this.log("Ship still navigating, waiting until completion");
        await this.waitUntil(this.navigationUntil);
      }

      await this.waitForCooldown("reactor");

      if (this.isDocked) {
        await this.orbit();
      }

      const res = await this.queue(async () => {
        const res = await this.api.fleet.jumpShip(this.symbol, {
          waypointSymbol: waypointSymbol,
        });
        `Jumping from ${res.data.data.nav.route.departure.systemSymbol}.${res.data.data.nav.route.departure.symbol} to ${res.data.data.nav.route.destination.systemSymbol}.${res.data.data.nav.route.destination.symbol}`
        return res
      });
      const nowAfterNav = Date.now();

      this._currentSystemSymbol =
        res.data.data.nav.route.destination.systemSymbol;
      this._currentWaypointSymbol = res.data.data.nav.route.destination.symbol;
      await this.updateLocationObjects();

      const navResult = await processNav(this.symbol, res.data.data.nav);

      await processCooldown(this.symbol, res.data.data.cooldown);

      let expiry: Date | undefined = this.handleExpiration(res.data.data.cooldown.expiration);

      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });

      try {
        const departureSystem = await prisma.system.findFirstOrThrow({
          where: {
            symbol: res.data.data.nav.route.departure.systemSymbol,
          },
        });
        const destinationSystem = await prisma.system.findFirstOrThrow({
          where: {
            symbol: res.data.data.nav.route.destination.systemSymbol,
          },
        });

        await prisma.travelLog.create({
          data: {
            shipSymbol: this.symbol,
            fromSystemSymbol: res.data.data.nav.route.departure.systemSymbol,
            toSystemSymbol: res.data.data.nav.route.destination.systemSymbol,
            fromWaypoint: res.data.data.nav.route.departure.symbol,
            toWaypoint: res.data.data.nav.route.destination.symbol,
            method: "jump",
            engineSpeed: this.engineSpeed,
            fuelConsumed: 0,
            flightMode: ShipNavFlightMode.Cruise,
            distance: Math.round(
              getDistance(departureSystem, destinationSystem)
            ),
            cooldown: expiry ? expiry.getTime() - Date.now() : 0,
            flightDuration:
              new Date(res.data.data.nav.route.arrival).getTime() - nowAfterNav,
          },
        });
      } catch (error) {
        console.error("Could not log travel", error);
      }

      if (waitForTimeout) {
        const arrivalTime = new Date(res.data.data.nav.route.arrival);
        const waitTime = arrivalTime.getTime() - Date.now() + 200;
        this.log(`Waiting ${waitTime} ms until arrival`);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(navResult);
          }, waitTime);
        });
      } else {
        return navResult;
      }
    } catch (error) {
      if (isAxiosApiErrorResponse(error) && error.response?.data?.error?.code === 4204) {
        this.log(`Already at ${waypointSymbol}`);
        return;
      } else if (error instanceof AxiosError) {
        console.error(`issue in jump for ${this.symbol}`, error.response?.data);
        throw error;
      } else {
        throw error;
      }
    }
  }

  async extract(survey?: Survey) {
    return this.catchAxiosCodes('extract', async () => {
      await this.waitForCooldown("reactor");

      const res = await this.queue(() => {
        const fromDeposit = survey ? ` from deposit ${survey.signature}` : "";
        this.log(`Extracting resources${fromDeposit}`);
        return this.api.fleet.extractResources(this.symbol, {
          survey: survey,
        });
      });

      this.log(
        `Extracted ${res.data.data.extraction.yield.units} units of ${res.data.data.extraction.yield.symbol}, ${res.data.data.cargo.units}/${res.data.data.cargo.capacity} filled`
      );

      await processCooldown(this.symbol, res.data.data.cooldown);
      this.cargo = res.data.data.cargo.units;
      const newShipInfo = await processCargo(this.symbol, res.data.data.cargo);

      let expiry: Date | undefined = this.handleExpiration(res.data.data.cooldown.expiration);

      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });

      return {
        ship: newShipInfo,
        extract: res.data,
      };
    }, {
      4228: async () => {
        this.log(`Cargo at max capacity`);

        const response: ExtractResources201Response = {
          data: {
            extraction: {
              ["yield"]: {
                symbol: "FUEL",
                units: 0,
              },
              shipSymbol: this.symbol,
            },
            cargo: {
              capacity: 100,
              units: 100,
              inventory: [],
            },
            cooldown: {
              remainingSeconds: 0,
              shipSymbol: this.symbol,
              totalSeconds: 0,
              expiration: new Date().toISOString(),
            },
          },
        };
        return Promise.resolve({
          ship: null,
          extract: response,
        });
      }
    })
  }

  async refuel() {
    return this.catchAxiosCodes('refuel', async () => {
      if (!this.isDocked) {
        await this.dock()
      }

      const beforeDetails = await this.queue(() => {
        return this.api.agents.getMyAgent();
      });
      const res = await this.queue(() => {
        this.log(`Refueling ship`);
        return this.api.fleet.refuelShip(this.symbol);
      });

      const cost =
        beforeDetails.data.data.credits - res.data.data.agent.credits;

      await processAgent(res.data.data.agent);

      this.fuel = res.data.data.fuel.current;
      this.maxFuel = res.data.data.fuel.capacity;

      this.log(
        `New fuel ${res.data.data.fuel.current}/${res.data.data.fuel.capacity} at cost of ${cost}`
      );
      await this.navigateMode("CRUISE");

      const result = await processFuel(this.symbol, res.data.data.fuel);

      ee.emit('event', {
        type: 'AGENT',
        data: res.data.data.agent
      })
      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });

      return result;
    });
  }

  async dock() {
    return this.catchAxiosCodes('dock', async () => {
      return this.queue(async () => {
        this.log(`Docking ship`);

        const res = await this.api.fleet.dockShip(this.symbol);

        this.isDocked = true;
        return processNav(this.symbol, res.data.data.nav);
      });
    });
  }

  async orbit() {
    return this.catchAxiosCodes('orbit', async () => {
      return this.queue(async () => {
        this.log(`Orbiting ship`);
        const res = await this.api.fleet.orbitShip(this.symbol);

        this.isDocked = false;

        return processNav(this.symbol, res.data.data.nav);
      });
    })
  }

  async purchaseShip(shipType: ShipType) {
    return this.catchAxiosCodes('purchase ship', async () => {
      return this.queue(async () => {
        this.log(`Purchasing ship ${shipType}`);

        const res = await this.api.fleet.purchaseShip({
          shipType: shipType,
          waypointSymbol: this.currentWaypointSymbol,
        });

        await processShip(res.data.data.ship);
        //await processTransaction(res.data.data.transaction);
        await processAgent(res.data.data.agent);
      });
    });
  }

  async construction() {
    return this.catchAxiosCodes('construction', async () => {
      return this.queue(async () => {
        this.log(`Retrieving waypoint construction information`);
        const res = await this.api.systems.getConstruction(this.currentSystemSymbol, this.currentWaypointSymbol);

        return processConstruction(res.data);
      });
    })
  }

  private async catchAxiosCodes<T>(action: string, fn: () => Promise<T>, handledCodes?: Record<string, () => Promise<T>>) {
    try {
      return await fn()
    } catch(error) {
      if (isAxiosApiErrorResponse(error)) {
        console.log(
          `error ${action} for ${this.symbol}`,
          error.response?.data ? error.response.data : error.toString()
        );
        const code = error.response?.data.error.code
        if (code && handledCodes && handledCodes[code]) {
          return handledCodes[code]()
        } else {
          throw error
        }
      } else {
        throw error;
      }
    }
  }

  async contract() {
    return this.catchAxiosCodes('contract', async () => {
      const result = await this.queue(async () => {
        this.log(`Negotiating contract`);
        const res = await this.api.fleet.negotiateContract(this.symbol);

        fs.writeFileSync(
          "./dumps/contract.json",
          JSON.stringify(res.data.data.contract, null, 2)
        );

        return res;
      });
      return result;
    });
  }

  async chart() {
    return this.catchAxiosCodes('chart', async () => {
      this.log(`Charting current position`);

      let waypointData;
      try {
        const res = await this.queue(async () =>
          this.api.fleet.createChart(this.symbol)
        );
        res.data.data.waypoint.chart =
          res.data.data.waypoint.chart ?? res.data.data.chart;
        waypointData = res.data.data.waypoint;
      } catch (error) {
        if (isAxiosApiErrorResponse(error)) {
          console.log(
            "error during chart, updating waypoint information",
            error.response?.data ? error.response.data : error.toString()
          );
          await this.updateShipStatus();
          const waypointInfo = await this.queue(async () => {
            if (!this.currentSystemSymbol || !this.currentWaypointSymbol) {
              throw new Error("No current system or waypoint");
            }
            return this.api.systems.getWaypoint(
              this.currentSystemSymbol,
              this.currentWaypointSymbol
            )
          });
          waypointData = waypointInfo.data.data;
        } else {
          throw error;
        }
      }
      const waypoint = await storeWaypoint(waypointData);
      const shipData = await returnShipData(this.symbol);

      return {
        ship: shipData,
        waypoint: waypoint,
      };
    })
  }

  async navigateMode(mode: ShipNavFlightMode) {
    return this.catchAxiosCodes('navigateMode', async () => {
      if (this.navMode === mode) {
        return;
      }
      this.log(`Setting navigate mode to ${mode}`);
      const res = await this.queue(async () =>
        this.api.fleet.patchShipNav(this.symbol, {
          flightMode: mode,
        })
      );
      this.navMode = mode;

      await processNav(this.symbol, res.data.data);

      return returnShipData(this.symbol);
    })
  }

  async updateCurrentCargo() {
    return this.catchAxiosCodes('currentCargo', async () => {
      const cargo = await this.queue(() => {
        return this.api.fleet.getMyShipCargo(this.symbol);
      });

      this.currentCargo = {}
      cargo.data.data.inventory.forEach((item) => {
        this.currentCargo[item.symbol] = item.units;
        this.log(`Cargo: ${item.symbol} x${item.units}`);
      });

      this.cargo = cargo.data.data.units;
      return processCargo(this.symbol, cargo.data.data);
    });
  }

  async survey() {
    return this.catchAxiosCodes('survey', async () => {
      await this.waitForCooldown("reactor");

      const survey = await this.queue(() => {
        return this.api.fleet.createSurvey(this.symbol);
      });

      survey.data.data.surveys.forEach((item) => {
        this.log(
          `Survey: ${item.signature} [${item.size}] ${item.deposits
            .map((d) => d.symbol)
            .join(", ")}, expires ${item.expiration}`
        );
      });

      fs.writeFileSync(
        `dumps/survey${survey.data.data.surveys[0].signature}`,
        JSON.stringify(survey.data.data, null, 2)
      );


      this.handleExpiration(survey.data.data.cooldown.expiration)

      const ship = processCooldown(this.symbol, survey.data.data.cooldown);

      return {
        ship: ship,
        survey: survey,
      };
    });
  }

  handleExpiration(expiration: string | undefined) {
    if (expiration) {
      const expiry = new Date(expiration);
      const waitTime = expiry.getTime() - Date.now() + 200;
      this.setCooldown("reactor", waitTime);
      return expiry;
    }
    return undefined;
  }

  async yeet(good: string, quantity: number) {
    return this.catchAxiosCodes('yeet', async () => {
      const result = await this.queue(() =>
        this.api.fleet.jettison(this.symbol, {
          units: quantity,
          symbol: good as TradeSymbol,
        })
      );
      this.log(`Jettisoned ${quantity} ${good}`);
      return result;
    });
  }

  async purchaseCargo(good: string, quantity: number) {
    let shipData: any = undefined;
    return this.catchAxiosCodes('purchaseCargo', async () => {
      if (!this.isDocked) {
        await this.dock()
      }

      let marketBefore = await this.queue(() =>
        this.api.systems.getMarket(
          this.currentSystemSymbol,
          this.currentWaypointSymbol
        )
      );
      let boughtGoodBefore = marketBefore.data.data.tradeGoods?.find(
        (g) => g.symbol === good
      );
      if (!boughtGoodBefore) {
        throw new Error(`Cannot buy ${good} at waypoint ${this.currentWaypointSymbol}`);
      }
      let totalBought = 0;
      const purchasePerCall = Math.min(boughtGoodBefore?.tradeVolume, quantity)
      for(let i = 0; i < quantity; i += purchasePerCall) {
        const result = await this.queue(() =>
          this.api.fleet.purchaseCargo(this.symbol, {
            symbol: good as TradeSymbol,
            units: Math.min(quantity - totalBought, purchasePerCall),
          })
        );
        let marketAfter = await this.queue(() =>
          this.api.systems.getMarket(
            this.currentSystemSymbol,
            this.currentWaypointSymbol
          )
        );
        await storeMarketInformation(marketAfter.data);
        await processAgent(result.data.data.agent)
        this.cargo = result.data.data.cargo.units;
        await processCargo(this.symbol, result.data.data.cargo);
        this.updateInventory(result.data.data.cargo.inventory);
        ee.emit('event', {
          type: 'AGENT',
          data: result.data.data.agent
        })
        const boughtGood = marketAfter.data.data.tradeGoods?.find(
          (g) => g.symbol === good
        );
        this.log(
          `Purchased ${quantity} of ${good} for ${result.data.data.transaction.pricePerUnit} each. Total price ${result.data.data.transaction.totalPrice}.`
        );
        if (boughtGood && boughtGoodBefore) {
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
              supplyAfter: boughtGood.supply,
            },
          });
        } else {
          this.log("Could not log trade, missing market information")
        }
        marketBefore = marketAfter;
        boughtGoodBefore = boughtGood;
      }

      ee.emit("event", {
        type: "NAVIGATE",
        data: await returnShipData(this.symbol),
      });
    })
  }

  async sellCargo(
    tradeGoodSymbol: string,
    units: number,
    market?: GetMarket200Response
  ) {
    return this.catchAxiosCodes('sellCargo', async () => {
      if (!this.isDocked) {
        await this.dock()
      }

      if (!market) {
        const axiosData = await this.queue(() =>
          this.api.systems.getMarket(
            this.currentSystemSymbol,
            this.currentWaypointSymbol
          )
        );
        market = axiosData.data;
      }

      const good = market.data.tradeGoods?.find(
        (g) => g.symbol === tradeGoodSymbol
      );
      if (!good) {
        throw new Error(`Cannot sell ${tradeGoodSymbol} here`);
      }

      const tradeVolume = good?.tradeVolume;

      const soldGoodBefore = market.data.tradeGoods?.find(
        (g) => g.symbol === tradeGoodSymbol
      );
      let leftToSell = units;
      do {
        const result = await this.queue(() => {
          this.log(`Selling ${units} of ${tradeGoodSymbol}`);
          return this.api.fleet.sellCargo(this.symbol, {
            symbol: tradeGoodSymbol as TradeSymbol,
            units: Math.min(units, tradeVolume),
          });
        });
        leftToSell -= Math.min(units, tradeVolume);
        const marketAfter = await this.queue(() =>
          this.api.systems.getMarket(
            this.currentSystemSymbol,
            this.currentWaypointSymbol
          )
        );
        const soldGood = marketAfter.data.data.tradeGoods?.find(
          (g) => g.symbol === tradeGoodSymbol
        );
        if (soldGood && soldGoodBefore) {
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
            },
          });
        } else {
          this.log("Could not log trade, missing market information")
        }
        this.log(
          `Sold ${Math.min(
            units,
            tradeVolume
          )} units of ${tradeGoodSymbol} for ${
            result.data.data.transaction.pricePerUnit
          } each, total ${result.data.data.transaction.totalPrice}. Credits ${
            result.data.data.agent.credits
          }.`
        );
        await storeMarketInformation(marketAfter.data);
        await processAgent(result.data.data.agent);
        this.cargo = result.data.data.cargo.units;
        await processCargo(this.symbol, result.data.data.cargo);
        this.updateInventory(result.data.data.cargo.inventory);

        ee.emit('event', {
          type: 'AGENT',
          data: result.data.data.agent
        })
        ee.emit("event", {
          type: "NAVIGATE",
          data: await returnShipData(this.symbol),
        });

        return result.data.data.transaction;
      } while (leftToSell > 0);
    })
  }

  async refine() {
    await this.waitForCooldown("reactor");

    this.log(`Refining`);

    const cargo = await prisma.shipCargo.findMany({
      where: {
        shipSymbol: this.symbol,
      },
    });

    if (cargo.length === 0) {
      throw new Error("Cannot refine without cargo");
    }

    const firstOre = cargo.find((c) => c.tradeGoodSymbol.endsWith("_ORE"));
    if (!firstOre) {
      throw new Error("Cannot refine without ore");
    }

    const produceSymbol = firstOre.tradeGoodSymbol.replace("_ORE", "");

    const res = await this.queue(() =>
      this.api.fleet.shipRefine(this.symbol, {
        produce: produceSymbol as ShipRefineRequestProduceEnum,
      })
    );

    this.cargo = res.data.data.cargo.units;
    const afterCargo = await processCargo(this.symbol, res.data.data.cargo);
    this.updateInventory(res.data.data.cargo.inventory);

    const expiry = this.handleExpiration(res.data.data.cooldown.expiration);

    return afterCargo;
  }

  async attemptRefuel() {
    const fuelHere = await prisma.marketPrice.findFirst({
      where: {
        waypointSymbol: this.currentWaypointSymbol,
        tradeGoodSymbol: "FUEL",
      },
    });
    if (fuelHere) {
      const ship = await prisma.ship.findFirstOrThrow({
        where: {
          symbol: this.symbol,
        },
      });
      if (ship.fuelAvailable < ship.fuelCapacity) {
        await this.refuel();
      }
    }
  }

  async sellAllCargo() {
    return this.catchAxiosCodes('sellAllCargo', async () => {
      this.log("Selling all cargo");
      const cargo = await this.queue(() => {
        return this.api.fleet.getMyShipCargo(this.symbol);
      });
      const market = await this.queue(() =>
        this.api.systems.getMarket(
          this.currentSystemSymbol,
          this.currentWaypointSymbol
        )
      );

      let transactions: MarketTransaction[] = [];

      for (const item of cargo.data.data.inventory) {
        if (item.symbol === "ANTIMATTER") {
          continue;
        }
        transactions.push(
          await this.sellCargo(item.symbol, item.units, market.data)
        );
      }
      return transactions;
    })
  }

  async scanWaypoints() {
    return this.catchAxiosCodes('scanWaypoints', async () => {
      await this.waitForCooldown("reactor");

      const res = await this.queue(() => {
        this.log(`Scanning waypoints`);
        return this.api.fleet.createShipWaypointScan(this.symbol);
      });
      fs.writeFileSync(
        `dumps/scanresult${res.data.data.waypoints[0].systemSymbol}.json`,
        JSON.stringify(res.data.data.waypoints, null, 2)
      );

      const expiry = this.handleExpiration(res.data.data.cooldown.expiration);

      await storeWaypointScan(
        res.data.data.waypoints[0].systemSymbol,
        res.data.data
      );
      const cooldown = await processCooldown(
        this.symbol,
        res.data.data.cooldown
      );

      return cooldown;
    })
  }

  async scanShips() {
    return this.catchAxiosCodes('scanShips', async () => {
      await this.waitForCooldown("reactor");

      const res = await this.queue(() => {
        this.log(`Scanning ships`);
        return this.api.fleet.createShipShipScan(this.symbol);
      });

      this.log(
        `Scanned for ships, found ${res.data.data.ships.length} ships in scan range.`
      );

      const expiry = this.handleExpiration(res.data.data.cooldown.expiration);

      await storeShipScan(res.data.data);
      const cooldown = await processCooldown(
        this.symbol,
        res.data.data.cooldown
      );

      return cooldown;
    })
  }

  async market() {
    const res = await this.queue(() => {
      this.log(`Retrieving market information`);
      return this.api.systems.getMarket(
        this.currentSystemSymbol,
        this.currentWaypointSymbol
      );
    });

    await storeMarketInformation(res.data);

    // axios.put('https://st.feba66.de/prices', res.data.data.tradeGoods).catch(error => {
    //     console.log("Error loading market data to feba66", error)
    // }).then(() => {
    //     console.log("Uploaded market data to feba66")
    // })

    return res.data.data;
  }

  async jumpgate() {
    const res = await this.queue(() => {
      this.log(`Retrieving jumpgate information`);
      return this.api.systems.getJumpGate(
        this.currentSystemSymbol,
        this.currentWaypointSymbol
      );
    });

    await storeJumpGateInformation(
      this.currentSystemSymbol,
      this.currentWaypointSymbol,
      res.data
    );

    return res.data.data;
  }

  async shipyard() {
    const res = await this.queue(() => {
      this.log(`Retrieving shipyard information`);
      return this.api.systems.getShipyard(
        this.currentSystemSymbol,
        this.currentWaypointSymbol
      );
    });

    await processShipyard(res.data.data);

    fs.writeFileSync(
      `dumps/shipyardInformation-${this.currentWaypointSymbol}.json`,
      JSON.stringify(res.data.data, null, 2)
    );

    // axios.put('https://st.feba66.de/markets', res.data.data).catch(error => {
    //     console.log("Error loading market data to feba66", error)
    // }).then(() => {
    //     console.log("Uploaded market data to feba66")
    // })

    return res.data.data;
  }
}
