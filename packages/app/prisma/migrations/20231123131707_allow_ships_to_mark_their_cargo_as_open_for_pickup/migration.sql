-- CreateEnum
CREATE TYPE "CargoState" AS ENUM ('OPEN_PICKUP', 'MANAGED');

-- AlterTable
ALTER TABLE "Ship" ADD COLUMN     "cargoState" "CargoState" NOT NULL DEFAULT 'MANAGED';
