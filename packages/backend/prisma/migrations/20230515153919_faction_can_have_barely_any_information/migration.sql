-- DropForeignKey
ALTER TABLE `Faction` DROP FOREIGN KEY `Faction_headquartersSymbol_fkey`;

-- AlterTable
ALTER TABLE `Faction` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `headquartersSymbol` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Faction` ADD CONSTRAINT `Faction_headquartersSymbol_fkey` FOREIGN KEY (`headquartersSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;
