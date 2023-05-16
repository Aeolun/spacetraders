-- AlterTable
ALTER TABLE `ShipModule` ADD COLUMN `effectName` VARCHAR(191) NULL,
    ADD COLUMN `value` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipMount` ADD COLUMN `effectName` VARCHAR(191) NULL,
    ADD COLUMN `value` INTEGER NULL;
