/*
  Warnings:

  - You are about to drop the `_FactionToSystem` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Ship` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `_FactionToSystem`;
