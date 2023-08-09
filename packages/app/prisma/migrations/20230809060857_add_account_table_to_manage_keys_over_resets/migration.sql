/*
  Warnings:

  - The primary key for the `Agent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `Agent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[symbol,reset]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Agent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `reset` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Agent` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `reset` VARCHAR(191) NOT NULL,
    MODIFY `accountId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `currentAgentId` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_email_key`(`email`),
    INDEX `Account_currentAgentId_idx`(`currentAgentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Agent_accountId_idx` ON `Agent`(`accountId`);

-- CreateIndex
CREATE UNIQUE INDEX `Agent_symbol_reset_key` ON `Agent`(`symbol`, `reset`);
