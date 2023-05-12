import {Ship} from "@app/ship/ship";

export class ShipStore {
    private ships: Record<string, Ship> = {}

    constructor() {}

    addShip(symbol: string) {
        this.ships[symbol] = new Ship(symbol)
    }

    getShip(symbol: string) {
        if (!this.ships[symbol]) {
            throw new Error("Ship with symbol does not exists.")
        }
        return this.ships[symbol]
    }
}

export const defaultShipStore = new ShipStore()