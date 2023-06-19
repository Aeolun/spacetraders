import {Ship} from "@app/ship/ship";
import {getAgentToken} from "@app/ship/getAgentToken";

export interface ShipBehavior {
  logic: (ship: Ship, parameters: BehaviorParamaters) => Promise<void>,
  cancel: () => void
}
export const shipBehaviors: Record<string, ShipBehavior> = {}
export interface BehaviorParamaters {
  systemSymbol?: string,
  range?: number
  abortIfCancelled?: () => void
}

export class CancelledError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export const startBehaviorForShip = (symbol: string, parameters: BehaviorParamaters, logic: (ship: Ship, parameters: BehaviorParamaters) => Promise<void>) => {
  if (!shipBehaviors[symbol]) {
    let cancelled = false;
    shipBehaviors[symbol] = {
      logic: logic,
      cancel: () => {
        cancelled = true;
      }
    }
    const onCancel = () => {
      delete shipBehaviors[symbol]
    }
    const loop = async () => {
      const token = await getAgentToken(symbol.split('-')[0])
      const ship = new Ship(token, symbol)

      let started = false

      while (true) {
        if (!started) {
          await ship.validateCooldowns()
          await ship.updateShipStatus()

          started = true
        }

        const behavior = shipBehaviors[symbol]
        if (cancelled) {
          console.log(`Ship behavior for ${symbol} cancelled`)
          onCancel()
          break
        }
        try {
          await behavior.logic(ship, {
            ...parameters,
            abortIfCancelled: () => {
              if (cancelled) {
                throw new CancelledError("Behavior cancelled")
              }
            }
          })
        } catch (error) {
          if (error instanceof CancelledError) {
            console.log(`Ship behavior for ${symbol} cancelled by abort handler`)
            onCancel()
            break
          } else {
            console.log("Unexpected issue in behavior, restarting in 60s: ", error?.response?.data ? error?.response?.data : error)
            await ship.setOverallGoal(null)
            await ship.waitFor(60000)

            started = false
          }
        }
      }
    }
    loop().catch(async error => {
      console.log("Ship behavior loop failed: ", error);
      delete shipBehaviors[symbol]
    })
  } else {
    shipBehaviors[symbol].logic = logic
  }
}