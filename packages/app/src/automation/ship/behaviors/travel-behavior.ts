import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {Ship} from "@auto/ship/ship";
import {prisma} from "@auto/prisma";
import {defaultWayfinder, printRoute} from "@auto/wayfinding";
import {LinkedListItem} from "@aeolun/dijkstra-calculator";
import {ShipNavFlightMode} from "spacetraders-sdk";

export async function travelBehavior(toSystem: string, ship: Ship, preferredWaypointSymbol?: string, options?: {
    executeEveryStop?: () => Promise<void>
    jumpOnly?: boolean
}) {
    ship.log(`Traveling to ${toSystem}`)
    await ship.setTravelGoal(toSystem);
    while(true) {
        try {
            if (!ship.currentSystemSymbol) {
                await ship.validateCooldowns()
                await ship.updateShipStatus()
            }

            await options?.executeEveryStop?.()


            return true
        } catch(error) {
            console.log("Unexpected issue in agent, restarting in 60s: ",error?.response?.data ? error?.response?.data : error)
            await ship.waitFor(60000)
        }
    }
}