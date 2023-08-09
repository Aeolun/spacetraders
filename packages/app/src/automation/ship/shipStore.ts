import {Ship} from "@auto/ship/ship";
import {Context} from "@auto/context";

export class ShipStore {
    private ships: Record<string, Ship> = {}

    constructor() {}

    constructShipFor(token: string, agent: string, symbol: string) {
        if (!this.ships[symbol]) {
            this.ships[symbol] = new Ship(token, symbol)
        }
        return this.ships[symbol]
    }
}

export const defaultShipStore = new ShipStore()