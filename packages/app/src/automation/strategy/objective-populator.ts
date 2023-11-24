import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {ExploreStatus, prisma} from "@common/prisma";
import {ExploreObjective} from "@auto/strategy/objective/explore-objective";
import {findTrades} from "@auto/ship/behaviors/atoms/find-trades";
import {TradeObjective} from "@auto/strategy/objective/trade-objective";
import {UpdateMarketDataObjective} from "@auto/strategy/objective/update-market-data-objective";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {environmentVariables} from "@common/environment-variables";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {ShipType, Waypoint} from "spacetraders-sdk";
import {PurchaseShipObjective} from "@auto/strategy/objective/purchase-ship";
import {MineObjective} from "@auto/strategy/objective/mine-objective";
import {Ship} from "@auto/ship/ship";
import {Task} from "@auto/ship/task/task";
import {getDistance} from "@common/lib/getDistance";
import {scoreAsteroid} from "@auto/strategy/objective-populator/score-asteroid";
import {PickupCargoObjective} from "@auto/strategy/objective/pickup-cargo-objective";
import fs from "fs";
import {SurveyObjective} from "@auto/strategy/objective/survey-objective";
import {SiphonObjective} from "@auto/strategy/objective/siphon-objective";

export class ObjectivePopulator {
  private allowedObjectives: ObjectiveType[] = [];
  private allowedSystems: string[] = [];

  constructor(private orchestrator: Orchestrator<Ship, Task>) {}

  public addAllowedSystem(symbol: string) {
    this.allowedSystems.push(symbol)
  }

  public hasPossibleObjective(taskType: ObjectiveType) {
    return this.allowedObjectives.includes(taskType);
  }

  public addPossibleObjective(taskType: ObjectiveType) {
    this.allowedObjectives.push(taskType);
  }

  public removePossibleObjective(taskType: ObjectiveType) {
    this.allowedObjectives = this.allowedObjectives.filter(o => o !== taskType)
  }

  public async populateObjectives() {
    // read through current universe state and updates available tasks
    const agent = await getBackgroundAgent();
    let availableMoneyForPurchase = agent.credits - StrategySettings.FINANCIAL_BUFFER;

    // explore objectives
    if (this.allowedObjectives.includes(ObjectiveType.EXPLORE)) {
      // find unexplored systems
      // create explore tasks for them
      const systemsWithUnchartedWaypointsOrMarketplace = await prisma.system.findMany({
        where: {
          exploreStatus: ExploreStatus.UNEXPLORED,
          waypointsRetrieved: true
        }
      });
      //console.log("Found systems with uncharted waypoints or marketplaces", systemsWithUnchartedWaypointsOrMarketplace.length)
      if (systemsWithUnchartedWaypointsOrMarketplace.length > 0) {
        for (const system of systemsWithUnchartedWaypointsOrMarketplace) {
          this.orchestrator.addObjectiveIfNotExists(new ExploreObjective(system));
        }
      }
    }

    // market update objectives
    if (this.allowedObjectives.includes(ObjectiveType.UPDATE_MARKET)) {
      const updateableWaypoints = await prisma.waypoint.findMany({
        where: {
          marketLastUpdated: {
            lt: new Date(Date.now() - 1000 * 900)
          },
          exploreStatus: ExploreStatus.EXPLORED,
          traits: {
            some: {
              symbol: "MARKETPLACE"
            }
          }
        },
        include: {
          system: true,
          shipsAtWaypoint: {
            select: {
              symbol: true
            },
            where: {
              agent: environmentVariables.agentName,
              role: "SATELLITE"
            }
          }
        }
      })
      console.log("Found waypoints to update", updateableWaypoints.length)
      for (const waypoint of updateableWaypoints) {
        this.orchestrator.addObjectiveIfNotExists(new UpdateMarketDataObjective(waypoint.system, waypoint, waypoint.shipsAtWaypoint.length > 0 ? waypoint.shipsAtWaypoint[0].symbol : undefined))
      }
    }

    // purchase ship objectives
    if (this.allowedObjectives.includes(ObjectiveType.PURCHASE_SHIP)) {
      const purchaseableShips: Record<string, {
        max: number,
        current: number,
        cost: number
      }> = {
        [ShipType.Probe]: {
          max: StrategySettings.MAX_SATELLITES,
          current: await prisma.ship.count({
            where: {
              role: "SATELLITE"
            }
          }),
          cost: 30_000
        },
        [ShipType.LightHauler]: {
          max: StrategySettings.MAX_HAULERS,
          current: await prisma.ship.count({
            where: {
              frameSymbol: "FRAME_LIGHT_FREIGHTER"
            }
          }),
          cost: 500_000
        },
        [ShipType.MiningDrone]: {
          max: StrategySettings.MAX_MINING_DRONES,
          current: await prisma.ship.count({
            where: {
              frameSymbol: "FRAME_DRONE",
              role: "EXCAVATOR"
            }
          }),
          cost: 30_000
        },
        [ShipType.Surveyor]: {
          max: StrategySettings.MAX_SURVEYORS,
          current: await prisma.ship.count({
            where: {
              frameSymbol: "FRAME_DRONE",
              role: "SURVEYOR"
            }
          }),
          cost: 35_000
        },
        [ShipType.SiphonDrone]: {
          max: StrategySettings.MAX_SIPHONERS,
          current: await prisma.ship.count({
            where: {
              frameSymbol: "FRAME_DRONE",
              mounts: {
                some: {
                  symbol: "MOUNT_GAS_SIPHON_I"
                }
              }
            }
          }),
          cost: 50_000
        }
      }

      for (const shipType of Object.keys(purchaseableShips)) {
        const shipTypeData = purchaseableShips[shipType]
        const purchasableShips = shipTypeData.max - shipTypeData.current
        if (purchasableShips > 0) {
          for(let i = 0; i < purchasableShips; i++) {
            if (availableMoneyForPurchase > 0) {
              this.orchestrator.addObjectiveIfNotExists(new PurchaseShipObjective(shipType as ShipType, 1))
            }
            availableMoneyForPurchase -= shipTypeData.cost
          }
        }
      }
    }

    // trade objectives
    if (this.allowedObjectives.includes(ObjectiveType.TRADE)) {
      const trades = await findTrades({
        dbLimit: 250,
        resultLimit: 25,
        systemSymbols: this.allowedSystems
      })
      //console.log("Found trades", trades)

      for (const trade of trades) {
        const fromWaypoint = await prisma.waypoint.findFirstOrThrow({
          where: {
            symbol: trade.fromWaypointSymbol,
          },
          include: {
            system: {
              select: {
                symbol: true,
                x: true,
                y: true
              }
            }
          }
        })
        const toWaypoint = await prisma.waypoint.findFirstOrThrow({
          where: {
            symbol: trade.toWaypointSymbol,
          },
          include: {
            system: {
              select: {
                symbol: true,
                x: true,
                y: true
              }
            }
          }
        })
        this.orchestrator.addObjectiveIfNotExists(new TradeObjective(fromWaypoint, toWaypoint, trade.tradeSymbol, trade.amount, {
          maximumBuy: trade.sellPrice,
          minimumSell: trade.purchasePrice
        }))
      }
    }

    const asteroids = await prisma.waypoint.findMany({
      where: {
        exploreStatus: ExploreStatus.EXPLORED,
        type: {
          in: ['ASTEROID', 'ENGINEERED_ASTEROID']
        },
        modifiers: {
          none: {
            symbol: "CRITICAL_LIMIT"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        traits: true
      }
    })
    const asteroidBases = await prisma.waypoint.findMany({
      where: {
        exploreStatus: ExploreStatus.EXPLORED,
        type: {
          in: ['ASTEROID_BASE', "PLANET"]
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        traits: true
      }
    })

    asteroids.sort((a, b) => {
      return scoreAsteroid(b, asteroidBases) - scoreAsteroid(a, asteroidBases)
    })

    // mine objectives
    if (this.allowedObjectives.includes(ObjectiveType.MINE)) {
      for (const asteroid of asteroids) {
        this.orchestrator.addObjectiveIfNotExists(new MineObjective(asteroid, undefined, scoreAsteroid(asteroid, asteroidBases)))
      }
    }

    // survey objectives
    if (this.allowedObjectives.includes(ObjectiveType.SURVEY)) {
      for (const asteroid of asteroids) {
        this.orchestrator.addObjectiveIfNotExists(new SurveyObjective(asteroid, scoreAsteroid(asteroid, asteroidBases)+0.1))
      }
    }

    const gasGiants = await prisma.waypoint.findMany({
      where: {
        exploreStatus: ExploreStatus.EXPLORED,
        type: {
          in: ['GAS_GIANT']
        },
        modifiers: {
          none: {
            symbol: "CRITICAL_LIMIT"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        traits: true
      }
    })
    const fuelProcessors = await prisma.waypoint.findMany({
      where: {
        exploreStatus: ExploreStatus.EXPLORED,
        tradeGoods: {
          some: {
            tradeGoodSymbol: "HYDROCARBONS",
            kind: "IMPORT"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        traits: true
      }
    })

    if (this.allowedObjectives.includes(ObjectiveType.SIPHON)) {
      for (const gasGiant of gasGiants) {
        this.orchestrator.addObjectiveIfNotExists(new SiphonObjective(gasGiant, scoreAsteroid(gasGiant, fuelProcessors)+0.1))
      }
    }

    // pickup cargo objectives
    if (this.allowedObjectives.includes(ObjectiveType.PICKUP_CARGO)) {
      const waypoints = await prisma.ship.groupBy({
        _sum: {
          cargoUsed: true,
          cargoCapacity: true
        },
        by: 'currentWaypointSymbol',
        where: {
          cargoState: "OPEN_PICKUP",
          currentWaypoint: {
            exploreStatus: ExploreStatus.EXPLORED,
            systemSymbol: {
              in: this.allowedSystems
            },
          }
        },
        orderBy: {
          _sum: {
            cargoUsed: 'desc'
          }
        }
      })
      // make sure we do not fly to waypoints that do not have ships on them anymore
      this.orchestrator.removeObjectivesOfType(ObjectiveType.PICKUP_CARGO)
      for (const pickupOption of waypoints) {
        const waypoint = await prisma.waypoint.findFirstOrThrow({
          where: {
            symbol: pickupOption.currentWaypointSymbol
          }
        })
        this.orchestrator.addObjectiveIfNotExists(new PickupCargoObjective(waypoint, {
          waitForFullCargo: true
        }))
      }
    }
    fs.writeFileSync('objectives.json', JSON.stringify({
      objectives: this.orchestrator.getObjectives().map(o => ({
        objective: o.objective,
        priority: o.priority,
      })),
      objectiveData: this.orchestrator.getObjectiveData()
    }))
  }
}