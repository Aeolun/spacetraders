-- AlterEnum
ALTER TYPE "ObjectiveExecutionState" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "ObjectiveExecution" ADD COLUMN     "creditsReserved" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "nextObjectiveExecutionId" TEXT;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_nextObjectiveExecutionId_fkey" FOREIGN KEY ("nextObjectiveExecutionId") REFERENCES "ObjectiveExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
