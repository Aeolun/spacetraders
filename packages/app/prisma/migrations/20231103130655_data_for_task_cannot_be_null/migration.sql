/*
  Warnings:

  - Made the column `data` on table `ShipTask` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShipTask" ALTER COLUMN "data" SET NOT NULL;
