-- AlterTable
ALTER TABLE `MarketPrice` MODIFY `supply` VARCHAR(191) NULL,
    MODIFY `purchasePrice` INTEGER NULL,
    MODIFY `sellPrice` INTEGER NULL,
    MODIFY `tradeVolume` INTEGER NULL;

-- CreateIndex
CREATE INDEX `AutomationPlan_shipGroupSymbol_idx` ON `AutomationPlan`(`shipGroupSymbol`);

-- CreateIndex
CREATE INDEX `ShipGroup_shipConfigurationSymbol_idx` ON `ShipGroup`(`shipConfigurationSymbol`);
