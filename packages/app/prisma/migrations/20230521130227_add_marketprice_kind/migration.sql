/*
  Warnings:

  - Added the required column `kind` to the `MarketPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MarketPrice` ADD COLUMN `kind` ENUM('IMPORT', 'EXPORT', 'EXCHANGE') NOT NULL;
