/*
  Warnings:

  - Added the required column `supply` to the `TradeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeVolume` to the `TradeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TradeLog` ADD COLUMN `supply` VARCHAR(191) NOT NULL,
    ADD COLUMN `tradeVolume` INTEGER NOT NULL;
