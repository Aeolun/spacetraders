/*
  Warnings:

  - Added the required column `endpoint` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Server` ADD COLUMN `endpoint` VARCHAR(191) NOT NULL;
