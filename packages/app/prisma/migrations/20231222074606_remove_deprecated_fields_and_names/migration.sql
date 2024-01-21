/*
  Warnings:

  - You are about to drop the column `behaviorOnce` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `behaviorRange` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `currentBehavior` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `homeSystemSymbol` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `overalGoal` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `travelGoalSystemSymbol` on the `Ship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ship" DROP COLUMN "behaviorOnce",
DROP COLUMN "behaviorRange",
DROP COLUMN "currentBehavior",
DROP COLUMN "homeSystemSymbol",
DROP COLUMN "overalGoal",
DROP COLUMN "travelGoalSystemSymbol",
ADD COLUMN     "nextObjective" TEXT,
ADD COLUMN     "objective" TEXT;
