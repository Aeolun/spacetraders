/*
  Warnings:

  - Added the required column `supplyAfter` to the `TradeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TradeLog` ADD COLUMN `supplyAfter` VARCHAR(191) NOT NULL;
