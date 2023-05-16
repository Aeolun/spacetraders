-- AlterTable
ALTER TABLE `ShipEngine` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `speed` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipFrame` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `moduleSlots` INTEGER NULL,
    MODIFY `mountingPoints` INTEGER NULL,
    MODIFY `fuelCapacity` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipReactor` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `powerOutput` INTEGER NULL;
