/*
  Warnings:

  - You are about to drop the column `correlationId` on the `MarketTransaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ObjectiveExecutionState" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "MarketTransaction" DROP COLUMN "correlationId",
ADD COLUMN     "objectiveExecutionId" TEXT;

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "objectiveId" TEXT;

-- CreateTable
CREATE TABLE "ObjectiveExecution" (
    "id" TEXT NOT NULL,
    "state" "ObjectiveExecutionState" NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "creditDelta" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ObjectiveExecution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarketTransaction" ADD CONSTRAINT "MarketTransaction_objectiveExecutionId_fkey" FOREIGN KEY ("objectiveExecutionId") REFERENCES "ObjectiveExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveExecution" ADD CONSTRAINT "ObjectiveExecution_shipSymbol_fkey" FOREIGN KEY ("shipSymbol") REFERENCES "Ship"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
