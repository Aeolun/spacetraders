/*
  Warnings:

  - Added the required column `engineSymbol` to the `Ship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frameSymbol` to the `Ship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reactorSymbol` to the `Ship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ship` ADD COLUMN `engineSymbol` VARCHAR(191) NOT NULL,
    ADD COLUMN `frameSymbol` VARCHAR(191) NOT NULL,
    ADD COLUMN `reactorSymbol` VARCHAR(191) NOT NULL,
    MODIFY `cargoCapacity` INTEGER NULL,
    MODIFY `cargoUsed` INTEGER NULL;

-- CreateTable
CREATE TABLE `ShipFrame` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `moduleSlots` INTEGER NOT NULL,
    `mountingPoints` INTEGER NOT NULL,
    `fuelCapacity` INTEGER NOT NULL,
    `crewRequirement` INTEGER NOT NULL,
    `powerRequirement` INTEGER NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipReactor` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `powerOutput` INTEGER NOT NULL,
    `crewRequirement` INTEGER NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipEngine` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `speed` INTEGER NOT NULL,
    `crewRequirement` INTEGER NOT NULL,
    `powerRequirement` INTEGER NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipModule` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipMount` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ShipToShipModule` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ShipToShipModule_AB_unique`(`A`, `B`),
    INDEX `_ShipToShipModule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ShipToShipMount` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ShipToShipMount_AB_unique`(`A`, `B`),
    INDEX `_ShipToShipMount_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_frameSymbol_fkey` FOREIGN KEY (`frameSymbol`) REFERENCES `ShipFrame`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_reactorSymbol_fkey` FOREIGN KEY (`reactorSymbol`) REFERENCES `ShipReactor`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_engineSymbol_fkey` FOREIGN KEY (`engineSymbol`) REFERENCES `ShipEngine`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ShipToShipModule` ADD CONSTRAINT `_ShipToShipModule_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ship`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ShipToShipModule` ADD CONSTRAINT `_ShipToShipModule_B_fkey` FOREIGN KEY (`B`) REFERENCES `ShipModule`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ShipToShipMount` ADD CONSTRAINT `_ShipToShipMount_A_fkey` FOREIGN KEY (`A`) REFERENCES `Ship`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ShipToShipMount` ADD CONSTRAINT `_ShipToShipMount_B_fkey` FOREIGN KEY (`B`) REFERENCES `ShipMount`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
