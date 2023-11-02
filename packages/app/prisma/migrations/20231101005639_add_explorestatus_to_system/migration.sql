-- CreateEnum
CREATE TYPE "ExploreStatus" AS ENUM ('UNEXPLORED', 'EXPLORING', 'EXPLORED');

-- AlterTable
ALTER TABLE "System" ADD COLUMN     "exploreStatus" "ExploreStatus" DEFAULT 'UNEXPLORED',
ADD COLUMN     "exploredAt" TIMESTAMP(3);
