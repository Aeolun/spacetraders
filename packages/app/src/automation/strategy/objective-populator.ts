import {ObjectiveType} from "@auto/strategy/objective/abstract-objective";
import {Orchestrator} from "@auto/strategy/orchestrator";
import {CargoState, ExploreStatus, prisma} from "@common/prisma";
import {ExploreObjective} from "@auto/strategy/objective/explore-objective";
import {findTrades} from "@auto/ship/behaviors/atoms/find-trades";
import {TradeObjective} from "@auto/strategy/objective/trade-objective";
import {UpdateMarketDataObjective} from "@auto/strategy/objective/update-market-data-objective";
import {StrategySettings} from "@auto/strategy/stategy-settings";
import {environmentVariables} from "@common/environment-variables";
import {getBackgroundAgent} from "@auto/lib/get-background-agent";
import {ShipType, TradeSymbol} from "spacetraders-sdk";
import {PurchaseShipObjective} from "@auto/strategy/objective/purchase-ship";
import {MineObjective} from "@auto/strategy/objective/mine-objective";
import {Ship} from "@auto/ship/ship";
import {Task} from "@auto/ship/task/task";
import {scoreAsteroid} from "@auto/strategy/objective-populator/score-asteroid";
import {PickupCargoObjective} from "@auto/strategy/objective/pickup-cargo-objective";
import fs from "fs";
import {SurveyObjective} from "@auto/strategy/objective/survey-objective";
import {SiphonObjective} from "@auto/strategy/objective/siphon-objective";
import {Objective} from "@auto/strategy/objective/objective";
import {ConstructObjective} from "@auto/strategy/objective/construct-objective";
import {findPlaceToBuyGood} from "@auto/ship/behaviors/atoms/find-place-to-buy-good";
import {queryMarketToBuy} from "@auto/ship/behaviors/atoms/query-market-to-buy";
import {EmptyCargoObjective} from "@auto/strategy/objective/empty-cargo-objective";

export class ObjectivePopulator {
  private allowedObjectives: ObjectiveType[] = [];
  private allowedSystems: string[] = [];

  constructor(private orchestrator: Orchestrator<Ship, Task, Objective>) {}

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
          if (StrategySettings.MULTISYSTEM || agent.headquartersSymbol?.includes(system.symbol)) {
            this.orchestrator.addObjectiveIfNotExists(new ExploreObjective(system));
          }
        }
      }
    } else {
      this.orchestrator.removeObjectivesOfType(ObjectiveType.EXPLORE)
    }

    // market update objectives
    if (this.allowedObjectives.includes(ObjectiveType.UPDATE_MARKET)) {
      const updateableWaypoints = await prisma.waypoint.findMany({
        where: {
          marketLastUpdated: {
            lt: new Date(Date.now() - (1000 * 900 / StrategySettings.SPEED_FACTOR))
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
          const howMany = Math.min(Math.floor(availableMoneyForPurchase / shipTypeData.cost), purchasableShips)
          if (howMany > 0) {
            if (availableMoneyForPurchase > 0) {
              this.orchestrator.addObjectiveIfNotExists(new PurchaseShipObjective(shipType as ShipType, howMany, shipTypeData.cost))
              availableMoneyForPurchase -= shipTypeData.cost * howMany
            }
          }
        }
      }
    }

    // trade objectives
    if (this.allowedObjectives.includes(ObjectiveType.TRADE)) {
      const moneyImportance = Math.max(Math.min(5_000_000 / agent.credits - 1, 4), 0)
      console.log(5_000_000, ' / ', agent.credits, ' = ', moneyImportance)

      const trades = await findTrades({
        dbLimit: 250,
        resultLimit: 100,
        systemSymbols: this.allowedSystems,
        moneyImportance
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
        this.orchestrator.addOrUpdateObjective(new TradeObjective(fromWaypoint, toWaypoint, trade.tradeSymbol, trade.amount, {
          maximumBuy: trade.purchasePrice*1.2+20, // care less about fluctuations in cheap stuff
          minimumSell: Math.max(trade.purchasePrice-20, 0), // care less about fluctuations in cheap stuff
          maxShips: Math.max(Math.floor(trade.amount / 160), 1),
          priority: trade.priority/10,
          creditReservation: trade.reservation
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
            symbol: "UNSTABLE"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        system: true,
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
        traits: true,
        tradeGoods: {
          where: {
            tradeGoodSymbol: {
              in: [
                "IRON_ORE",
                "ALUMINUM_ORE",
                "QUARTZ_SAND",
                "ALUMINUM_ORE",
                "PLATINUM_ORE",
                "GOLD_ORE",
                "DIAMONDS",
                "URANITE_ORE",
                "MERITIUM_ORE",
                "SILVER_ORE",
                "COPPER_ORE",
                "PRECIOUS_STONES",
                "SILICON_CRYSTALS"
              ]
            }
          }
        }
      }
    })

    asteroids.sort((a, b) => {
      return scoreAsteroid(b, asteroidBases) - scoreAsteroid(a, asteroidBases)
    })

    // mine objectives
    if (this.allowedObjectives.includes(ObjectiveType.MINE)) {
      for (const asteroid of asteroids) {
        this.orchestrator.addObjectiveIfNotExists(new MineObjective(asteroid.system, asteroid, undefined, scoreAsteroid(asteroid, asteroidBases)))
      }
    }

    const asteroidsWithShips = await prisma.waypoint.findMany({
      where: {
        exploreStatus: ExploreStatus.EXPLORED,
        type: {
          in: ['ASTEROID', 'ENGINEERED_ASTEROID']
        },
        shipsAtWaypoint: {
          some: {
            agent: environmentVariables.agentName,
            cargoState: CargoState.OPEN_PICKUP
          }
        },
        modifiers: {
          none: {
            symbol: "UNSTABLE"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        system: true,
        traits: true
      }
    })

    // survey objectives
    if (this.allowedObjectives.includes(ObjectiveType.SURVEY)) {
      for (const asteroid of asteroidsWithShips) {
        this.orchestrator.addObjectiveIfNotExists(new SurveyObjective(asteroid.system, asteroid, scoreAsteroid(asteroid, asteroidBases)+0.1))
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
            symbol: "UNSTABLE"
          }
        },
        systemSymbol: {
          in: this.allowedSystems
        }
      },
      include: {
        system: true,
        traits: true,
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
        traits: true,
        tradeGoods: {
          where: {
            tradeGoodSymbol: {
              in: [
                "HYDROCARBONS",
                "LIQUID_NITROGEN",
                "LIQUID_HYDROGEN"
              ]
            }
          }
        }
      }
    })

    if (this.allowedObjectives.includes(ObjectiveType.SIPHON)) {
      for (const gasGiant of gasGiants) {
        this.orchestrator.addObjectiveIfNotExists(new SiphonObjective(gasGiant.system, gasGiant, scoreAsteroid(gasGiant, fuelProcessors)+0.1))
      }
    }

    if (this.allowedObjectives.includes(ObjectiveType.CONSTRUCT) && availableMoneyForPurchase > StrategySettings.MIN_CAPITAL_FOR_CONSTRUCTION) {
      const constructionSites = await prisma.waypoint.findMany({
        where: {
          exploreStatus: ExploreStatus.EXPLORED,
          isUnderConstruction: true,
          systemSymbol: {
            in: this.allowedSystems
          }
        },
        include: {
          system: true,
          construction: {
            include: {
              materials: true
            }
          }
        },
      })

      console.log('construction sites', constructionSites.length)

      // Do not keep old construction objectives if they are not needed anymore
      this.orchestrator.removeObjectivesOfType(ObjectiveType.CONSTRUCT)
      for (const constructionSite of constructionSites) {
        const necessaryMaterials = constructionSite.construction?.materials.reduce((acc, material) => {
          acc[material.tradeGoodSymbol] = material.required - material.fulfilled
          return acc
        }, {} as Record<string, number>)

        console.log('construction site', constructionSite.symbol, 'necessary materials', necessaryMaterials)

        if (necessaryMaterials) {
          for (const key of Object.keys(necessaryMaterials)) {
            const waypointsToBuy = await queryMarketToBuy([key], constructionSite.system.symbol)
            const placeToBuy = await findPlaceToBuyGood(waypointsToBuy, constructionSite, { [key]: necessaryMaterials[key] })
            if (necessaryMaterials[key] > 0 && placeToBuy[0].goods[0].supply !== "SCARCE" && placeToBuy[0].goods[0].supply !== "LIMITED") {

              const maxShipsBasedOnTradeVolume = Math.max(Math.floor(placeToBuy[0].goods[0].tradeVolume * 3 / 80), 1)
              const maxShipsBasedOnMoneyAvailableConstruction = Math.floor(availableMoneyForPurchase  / (Math.min(necessaryMaterials[key], 80) * placeToBuy[0].goods[0].pricePerUnit))
              if (maxShipsBasedOnMoneyAvailableConstruction > 0) {
                console.log('adding construction objective', constructionSite.symbol, key, 'still needed', necessaryMaterials[key], 'at price', placeToBuy[0].goods[0].pricePerUnit, 'from', placeToBuy[0].waypoint.symbol)
                this.orchestrator.addOrUpdateObjective(new ConstructObjective(constructionSite, key as TradeSymbol, necessaryMaterials[key], {
                  maxShips: Math.min(maxShipsBasedOnMoneyAvailableConstruction, maxShipsBasedOnTradeVolume),
                  creditReservation: Math.min(necessaryMaterials[key], 80) * placeToBuy[0].goods[0].pricePerUnit
                }))
              } else {
                console.log('not enough money to construct', key, 'at', constructionSite.symbol, 'at price', placeToBuy[0].goods[0].pricePerUnit, 'from', placeToBuy[0].waypoint.symbol)
              }
            }
          }
        }

      }
    }

    // dump your cargo objectives for ships without objective
    const ships = await prisma.ship.findMany({
      where: {
        agent: environmentVariables.agentName,
        cargoUsed: {
          gt: 0
        },
        objective: ''
      }
    })
    for (const ship of ships) {
      this.orchestrator.addObjectiveIfNotExists(new EmptyCargoObjective(ship.symbol, (ship.cargoCapacity && ship.cargoCapacity >= 40) ? 5 : 0))
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
          },
          include: {
            system: true,
          }
        })
        this.orchestrator.addObjectiveIfNotExists(new PickupCargoObjective(waypoint.system, waypoint, {
          waitForFullCargo: true,
          maxShips: StrategySettings.MAX_HAULERS_PER_SPOT
        }))
      }
    }
    fs.writeFileSync(`objectives${environmentVariables.apiEndpoint.replace(/[^a-zA-Z]+/g, '-')}.json`, JSON.stringify({
      objectives: Object.values(this.orchestrator.getObjectives()).map(o => ({
        objective: o.objective,
        creditReservation: o.creditReservation,
        priority: o.priority,
        maxShips: o.maxShips,
        requiredShipSymbols: o.requiredShipSymbols,
        isPersistent: o.isPersistent,
        type: o.type
      })),
      objectiveData: this.orchestrator.getObjectiveData()
    }))
  }
}