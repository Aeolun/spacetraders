/*
  Warnings:

  - Added the required column `flightMode` to the `TravelLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TravelLog` ADD COLUMN `flightMode` ENUM('DRIFT', 'STEALTH', 'CRUISE', 'BURN') NOT NULL;
