import {Ship} from "@auto/ship/ship";
import {getAgentToken} from "@auto/ship/getAgentToken";
import {availableLogic} from "@auto/ship/behaviors";
import {prisma, ShipBehavior} from "@auto/prisma";

export interface ShipBehaviorDescription {
  kind: ShipBehavior
  logic: (ship: Ship, parameters: BehaviorParameters) => Promise<void>,
  parameters: BehaviorParameters,
  cancel: () => void
}
export const shipBehaviors: Record<string, ShipBehaviorDescription> = {}
export interface BehaviorParameters {
  once?: boolean
  systemSymbol?: string,
  range?: number
  abortIfCancelled?: () => void
}

export class CancelledError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export const startBehaviorForShip = async (symbol: string, parameters: BehaviorParameters, kind: ShipBehavior) => {
  const logic = availableLogic.find(logic => logic.symbol === kind).logic
  if (!logic) {
    throw new Error(`No logic found for behavior ${kind}`)
  }
  const systemSymbol = parameters.systemSymbol ?? (await prisma.ship.findFirstOrThrow({ where: { symbol } })).currentSystemSymbol
  await prisma.ship.update({
    where: {
      symbol
    },
    data: {
      currentBehavior: kind,
      homeSystemSymbol: systemSymbol,
      behaviorRange: parameters.range ?? 1500,
      behaviorOnce: parameters.once ?? false
    }
  })
  if (!shipBehaviors[symbol]) {
    let cancelled = false;

    shipBehaviors[symbol] = {
      kind,
      logic: logic,
      parameters,
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
          if (parameters.once === true) {
            console.log(`Ship behavior for ${symbol} completed`)
            onCancel()
            break
          }
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
    shipBehaviors[symbol].parameters = parameters
  }
}