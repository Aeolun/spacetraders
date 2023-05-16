-- CreateTable
CREATE TABLE `MarketPrice` (
    `waypointSymbol` VARCHAR(191) NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `supply` VARCHAR(191) NOT NULL,
    `purchasePrice` INTEGER NOT NULL,
    `sellPrice` INTEGER NOT NULL,
    `tradeVolume` INTEGER NOT NULL,
    `updatedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`waypointSymbol`, `tradeGoodSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MarketPrice` ADD CONSTRAINT `MarketPrice_waypointSymbol_fkey` FOREIGN KEY (`waypointSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarketPrice` ADD CONSTRAINT `MarketPrice_tradeGoodSymbol_fkey` FOREIGN KEY (`tradeGoodSymbol`) REFERENCES `TradeGood`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
