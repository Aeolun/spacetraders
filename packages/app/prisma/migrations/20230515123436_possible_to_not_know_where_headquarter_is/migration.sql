-- DropForeignKey
ALTER TABLE `Agent` DROP FOREIGN KEY `Agent_headquartersSymbol_fkey`;

-- AlterTable
ALTER TABLE `Agent` MODIFY `headquartersSymbol` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_headquartersSymbol_fkey` FOREIGN KEY (`headquartersSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;
