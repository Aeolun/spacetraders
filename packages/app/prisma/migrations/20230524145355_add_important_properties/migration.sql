/*
  Warnings:

  - Added the required column `engineSpeed` to the `TravelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelConsumed` to the `TravelLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TravelLog` ADD COLUMN `engineSpeed` INTEGER NOT NULL,
    ADD COLUMN `fuelConsumed` INTEGER NOT NULL;
