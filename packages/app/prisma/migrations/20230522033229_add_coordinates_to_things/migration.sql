/*
  Warnings:

  - Added the required column `x` to the `JumpConnectedSystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `JumpConnectedSystem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `JumpConnectedSystem` ADD COLUMN `x` INTEGER NOT NULL,
    ADD COLUMN `y` INTEGER NOT NULL;
