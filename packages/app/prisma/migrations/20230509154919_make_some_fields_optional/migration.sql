-- DropForeignKey
ALTER TABLE `Waypoint` DROP FOREIGN KEY `Waypoint_factionSymbol_fkey`;

-- AlterTable
ALTER TABLE `Waypoint` MODIFY `factionSymbol` VARCHAR(191) NULL,
    MODIFY `chartSymbol` VARCHAR(191) NULL,
    MODIFY `chartSubmittedBy` VARCHAR(191) NULL,
    MODIFY `chartSubmittedOn` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Waypoint` ADD CONSTRAINT `Waypoint_factionSymbol_fkey` FOREIGN KEY (`factionSymbol`) REFERENCES `Faction`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;
