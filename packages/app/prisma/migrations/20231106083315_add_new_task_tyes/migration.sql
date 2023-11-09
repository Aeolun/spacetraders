-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskType" ADD VALUE 'PURCHASE';
ALTER TYPE "TaskType" ADD VALUE 'SELL';
ALTER TYPE "TaskType" ADD VALUE 'UPDATE_MARKET';
ALTER TYPE "TaskType" ADD VALUE 'SIPHON';
ALTER TYPE "TaskType" ADD VALUE 'MINE';
ALTER TYPE "TaskType" ADD VALUE 'SURVEY';
