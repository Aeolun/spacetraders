-- AlterTable
ALTER TABLE `Ship` ADD COLUMN `departureWaypointSymbol` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_departureWaypointSymbol_fkey` FOREIGN KEY (`departureWaypointSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;
