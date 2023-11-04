-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TRAVEL', 'EXPLORE');

-- CreateTable
CREATE TABLE "ShipTask" (
    "id" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShipTask" ADD CONSTRAINT "ShipTask_shipSymbol_fkey" FOREIGN KEY ("shipSymbol") REFERENCES "Ship"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
