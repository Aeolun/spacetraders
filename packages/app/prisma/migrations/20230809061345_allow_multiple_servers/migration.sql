/*
  Warnings:

  - The primary key for the `Server` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[symbol,reset,server]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `server` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Server` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Server` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Agent_symbol_reset_key` ON `Agent`;

-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `server` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Server` DROP PRIMARY KEY,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Agent_symbol_reset_server_key` ON `Agent`(`symbol`, `reset`, `server`);
