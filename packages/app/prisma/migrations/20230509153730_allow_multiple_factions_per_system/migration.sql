/*
  Warnings:

  - You are about to drop the column `factionSymbol` on the `System` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `System` DROP FOREIGN KEY `System_factionSymbol_fkey`;

-- AlterTable
ALTER TABLE `System` DROP COLUMN `factionSymbol`;

-- CreateTable
CREATE TABLE `_FactionToSystem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FactionToSystem_AB_unique`(`A`, `B`),
    INDEX `_FactionToSystem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FactionToSystem` ADD CONSTRAINT `_FactionToSystem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Faction`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FactionToSystem` ADD CONSTRAINT `_FactionToSystem_B_fkey` FOREIGN KEY (`B`) REFERENCES `System`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
