/*
  Warnings:

  - Added the required column `description` to the `ShipConfiguration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ShipConfiguration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ShipConfiguration` ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
