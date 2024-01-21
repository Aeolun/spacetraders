/*
  Warnings:

  - You are about to drop the column `credits` on the `MarketTransaction` table. All the data in the column will be lost.
  - You are about to drop the `TradeLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "MarketTransaction" DROP COLUMN "credits";

-- DropTable
DROP TABLE "TradeLog";

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "transactionType" "MarketTransationType" NOT NULL,
    "price" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "tradeVolume" INTEGER,
    "supply" TEXT,
    "activityLevel" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "objectiveExecutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ledger_shipSymbol_createdAt_idx" ON "Ledger"("shipSymbol", "createdAt");

-- CreateIndex
CREATE INDEX "Ledger_tradeGoodSymbol_createdAt_idx" ON "Ledger"("tradeGoodSymbol", "createdAt");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_objectiveExecutionId_fkey" FOREIGN KEY ("objectiveExecutionId") REFERENCES "ObjectiveExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
