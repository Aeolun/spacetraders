-- DropForeignKey
ALTER TABLE `Faction` DROP FOREIGN KEY `Faction_headquartersSymbol_fkey`;

-- AddForeignKey
ALTER TABLE `Faction` ADD CONSTRAINT `Faction_headquartersSymbol_fkey` FOREIGN KEY (`headquartersSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;
