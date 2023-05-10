-- DropForeignKey
ALTER TABLE `ShipCargo` DROP FOREIGN KEY `ShipCargo_shipSymbol_fkey`;

-- DropForeignKey
ALTER TABLE `ShipCargo` DROP FOREIGN KEY `ShipCargo_tradeGoodSymbol_fkey`;

-- DropForeignKey
ALTER TABLE `Waypoint` DROP FOREIGN KEY `Waypoint_systemSymbol_fkey`;

-- AddForeignKey
ALTER TABLE `Waypoint` ADD CONSTRAINT `Waypoint_systemSymbol_fkey` FOREIGN KEY (`systemSymbol`) REFERENCES `System`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipCargo` ADD CONSTRAINT `ShipCargo_shipSymbol_fkey` FOREIGN KEY (`shipSymbol`) REFERENCES `Ship`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipCargo` ADD CONSTRAINT `ShipCargo_tradeGoodSymbol_fkey` FOREIGN KEY (`tradeGoodSymbol`) REFERENCES `TradeGood`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
