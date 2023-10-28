/*
  Warnings:

  - Added the required column `fromSystemSymbol` to the `JumpConnectedSystem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toSystemSymbol` to the `JumpConnectedSystem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JumpConnectedSystem" ADD COLUMN     "fromSystemSymbol" TEXT NOT NULL,
ADD COLUMN     "toSystemSymbol" TEXT NOT NULL;
