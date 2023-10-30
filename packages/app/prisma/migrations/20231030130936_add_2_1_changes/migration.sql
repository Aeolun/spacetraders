/*
  Warnings:

  - The `supply` column on the `MarketPrice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `JumpConnectedSystem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Jumpgate` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MarketGoodSupply" AS ENUM ('ABUNDANT', 'HIGH', 'MODERATE', 'LIMITED', 'SCARCE');

-- CreateEnum
CREATE TYPE "MarketGoodActivityLevel" AS ENUM ('STRONG', 'GROWING', 'WEAK');

-- CreateEnum
CREATE TYPE "MarketTransationType" AS ENUM ('PURCHASE', 'SELL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WaypointType" ADD VALUE 'ASTEROID';
ALTER TYPE "WaypointType" ADD VALUE 'ENGINEERED_ASTEROID';
ALTER TYPE "WaypointType" ADD VALUE 'ASTEROID_BASE';
ALTER TYPE "WaypointType" ADD VALUE 'ARTIFICIAL_GRAVITY_WELL';
ALTER TYPE "WaypointType" ADD VALUE 'FUEL_STATION';

-- DropForeignKey
ALTER TABLE "JumpConnectedSystem" DROP CONSTRAINT "JumpConnectedSystem_fromWaypointSymbol_fkey";

-- DropForeignKey
ALTER TABLE "JumpConnectedSystem" DROP CONSTRAINT "JumpConnectedSystem_toWaypointSymbol_fkey";

-- DropForeignKey
ALTER TABLE "Jumpgate" DROP CONSTRAINT "Jumpgate_waypointSymbol_fkey";

-- AlterTable
ALTER TABLE "MarketPrice" ADD COLUMN     "activityLevel" "MarketGoodActivityLevel",
DROP COLUMN "supply",
ADD COLUMN     "supply" "MarketGoodSupply";

-- DropTable
DROP TABLE "JumpConnectedSystem";

-- DropTable
DROP TABLE "Jumpgate";

-- CreateTable
CREATE TABLE "Construction" (
    "symbol" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Construction_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "constructionId" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "required" INTEGER NOT NULL,
    "fulfilled" INTEGER NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaypointModifier" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "WaypointModifier_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "MarketTransation" (
    "id" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "tradeSymbol" TEXT NOT NULL,
    "type" "MarketTransationType" NOT NULL,
    "units" INTEGER NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketTransation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WaypointToWaypointModifier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_jumpConnectedTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Material_constructionId_idx" ON "Material"("constructionId");

-- CreateIndex
CREATE INDEX "Material_tradeGoodSymbol_idx" ON "Material"("tradeGoodSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "_WaypointToWaypointModifier_AB_unique" ON "_WaypointToWaypointModifier"("A", "B");

-- CreateIndex
CREATE INDEX "_WaypointToWaypointModifier_B_index" ON "_WaypointToWaypointModifier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_jumpConnectedTo_AB_unique" ON "_jumpConnectedTo"("A", "B");

-- CreateIndex
CREATE INDEX "_jumpConnectedTo_B_index" ON "_jumpConnectedTo"("B");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_constructionId_fkey" FOREIGN KEY ("constructionId") REFERENCES "Construction"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_tradeGoodSymbol_fkey" FOREIGN KEY ("tradeGoodSymbol") REFERENCES "TradeGood"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaypointToWaypointModifier" ADD CONSTRAINT "_WaypointToWaypointModifier_A_fkey" FOREIGN KEY ("A") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaypointToWaypointModifier" ADD CONSTRAINT "_WaypointToWaypointModifier_B_fkey" FOREIGN KEY ("B") REFERENCES "WaypointModifier"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jumpConnectedTo" ADD CONSTRAINT "_jumpConnectedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jumpConnectedTo" ADD CONSTRAINT "_jumpConnectedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
