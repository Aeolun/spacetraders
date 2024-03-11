-- CreateEnum
CREATE TYPE "ShipState" AS ENUM ('ORCHESTRATED', 'STUCK');

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "state" "ShipState" NOT NULL DEFAULT 'STUCK';
