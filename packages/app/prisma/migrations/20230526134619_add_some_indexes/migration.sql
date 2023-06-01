-- AlterTable
ALTER TABLE `Faction` ADD COLUMN `color` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `ShipLog_symbol_createdAt_idx` ON `ShipLog`(`symbol`, `createdAt`);

-- CreateIndex
CREATE INDEX `TradeLog_shipSymbol_createdAt_idx` ON `TradeLog`(`shipSymbol`, `createdAt`);

-- CreateIndex
CREATE INDEX `TradeLog_tradeGoodSymbol_createdAt_idx` ON `TradeLog`(`tradeGoodSymbol`, `createdAt`);

-- CreateIndex
CREATE INDEX `TravelLog_shipSymbol_createdAt_idx` ON `TravelLog`(`shipSymbol`, `createdAt`);
