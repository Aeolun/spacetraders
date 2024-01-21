/*
  Warnings:

  - You are about to drop the column `objectiveId` on the `Ship` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ObjectiveExecution" DROP CONSTRAINT "ObjectiveExecution_shipSymbol_fkey";

-- AlterTable
ALTER TABLE "ObjectiveExecution" ALTER COLUMN "shipSymbol" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ship" DROP COLUMN "objectiveId",
ADD COLUMN     "objectiveExecutionId" TEXT;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_objectiveExecutionId_fkey" FOREIGN KEY ("objectiveExecutionId") REFERENCES "ObjectiveExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveExecution" ADD CONSTRAINT "ObjectiveExecution_shipSymbol_fkey" FOREIGN KEY ("shipSymbol") REFERENCES "Ship"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;
