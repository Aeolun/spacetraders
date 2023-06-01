-- AlterTable
ALTER TABLE `TradeLog` ADD COLUMN `fuelCost` INTEGER NULL,
    ADD COLUMN `parentTrade` VARCHAR(191) NULL,
    ADD COLUMN `purchaseWaypointSymbol` VARCHAR(191) NULL,
    ADD COLUMN `sellWaypointSymbol` VARCHAR(191) NULL;
