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
import {ShipType} from "spacetraders-sdk";
import {PurchaseShipObjective} from "@auto/strategy/objective/purchase-ship";

export class ObjectivePopulator {
  private allowedObjectives: ObjectiveType[] = [];

  constructor(private orchestrator: Orchestrator) {}

  public addPossibleObjective(taskType: ObjectiveType) {
    this.allowedObjectives.push(taskType);
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
      console.log("Found systems with uncharted waypoints or marketplaces", systemsWithUnchartedWaypointsOrMarketplace.length)
      if (systemsWithUnchartedWaypointsOrMarketplace.length > 0) {
        for (const system of systemsWithUnchartedWaypointsOrMarketplace) {
          this.orchestrator.addObjective(new ExploreObjective(system));
        }
      }
    }

    // market update objectives
    if (this.allowedObjectives.includes(ObjectiveType.UPDATE_MARKET)) {
      const updateableWaypoints = await prisma.waypoint.findMany({
        where: {
          marketLastUpdated: {
            lt: new Date(Date.now() - 1000 * 3600)
          },
          exploreStatus: ExploreStatus.EXPLORED,
          traits: {
            some: {
              symbol: "MARKETPLACE"
            }
          }
        },
        include: {
          system: true
        }
      })
      console.log("Found waypoints to update", updateableWaypoints.length)
      for (const waypoint of updateableWaypoints) {
        this.orchestrator.addOrUpdateObjective(new UpdateMarketDataObjective(waypoint.system, waypoint))
      }
    }

    // purchase ship objectives
    if (this.allowedObjectives.includes(ObjectiveType.PURCHASE_SHIP)) {
      // probes
      const existingPurchaseOrders = this.orchestrator.getObjectives().filter(o => o.type === ObjectiveType.PURCHASE_SHIP && o.shipSymbol === ShipType.Probe).length
      const purchasableProbes = StrategySettings.MAX_SATELLITES - (await prisma.ship.count({
        where: {
          role: "SATELLITE"
        }
      })) - existingPurchaseOrders

      if (purchasableProbes > 0) {
        console.log('Still need', purchasableProbes, 'more probes')
        //for(let i = 0; i < purchasableProbes; i++) {
          console.log("Available money for purchase", availableMoneyForPurchase)
          if (availableMoneyForPurchase > 0) {
            console.log("Adding probe purchase order")
            this.orchestrator.addObjective(new PurchaseShipObjective(ShipType.Probe, 1))
          }
          availableMoneyForPurchase -= 60000
        //}
      }
    }

    // trade objectives
    if (this.allowedObjectives.includes(ObjectiveType.TRADE)) {
      const trades = await findTrades()
      console.log("Found trades", trades.length)

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
        this.orchestrator.addOrUpdateObjective(new TradeObjective(fromWaypoint, toWaypoint, trade.tradeSymbol, trade.amount))
      }
    }
  }
}