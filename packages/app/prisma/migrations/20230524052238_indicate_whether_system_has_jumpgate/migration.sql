-- AlterTable
ALTER TABLE `System` ADD COLUMN `hasJumpGate` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `ShipyardModel_shipConfigurationSymbol_idx` ON `ShipyardModel`(`shipConfigurationSymbol`);
