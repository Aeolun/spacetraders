/*
  Warnings:

  - You are about to drop the `Orbital` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orbital` DROP FOREIGN KEY `Orbital_waypointSymbol_fkey`;

-- AlterTable
ALTER TABLE `Waypoint` ADD COLUMN `orbitsSymbol` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Orbital`;

-- AddForeignKey
ALTER TABLE `Waypoint` ADD CONSTRAINT `Waypoint_orbitsSymbol_fkey` FOREIGN KEY (`orbitsSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;
