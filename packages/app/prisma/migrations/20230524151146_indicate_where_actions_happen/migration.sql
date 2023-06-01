/*
  Warnings:

  - Added the required column `waypointSymbol` to the `TradeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromSystemSymbol` to the `TravelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromWaypoint` to the `TravelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toSystemSymbol` to the `TravelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toWaypoint` to the `TravelLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TradeLog` ADD COLUMN `waypointSymbol` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `TravelLog` ADD COLUMN `fromSystemSymbol` VARCHAR(191) NOT NULL,
    ADD COLUMN `fromWaypoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `toSystemSymbol` VARCHAR(191) NOT NULL,
    ADD COLUMN `toWaypoint` VARCHAR(191) NOT NULL;
