/*
  Warnings:

  - You are about to drop the `MarketTransation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MarketTransation";

-- CreateTable
CREATE TABLE "MarketPriceHistory" (
    "waypointSymbol" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" "MarketGoodKind" NOT NULL,
    "supply" "MarketGoodSupply",
    "activityLevel" "MarketGoodActivityLevel",
    "purchasePrice" INTEGER,
    "sellPrice" INTEGER,
    "tradeVolume" INTEGER,
    "updatedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketPriceHistory_pkey" PRIMARY KEY ("waypointSymbol","tradeGoodSymbol","createdAt")
);

-- CreateTable
CREATE TABLE "MarketTransaction" (
    "id" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "tradeSymbol" TEXT NOT NULL,
    "type" "MarketTransationType" NOT NULL,
    "units" INTEGER NOT NULL,
    "pricePerUnit" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketPriceHistory_waypointSymbol_idx" ON "MarketPriceHistory"("waypointSymbol");

-- CreateIndex
CREATE INDEX "MarketPriceHistory_tradeGoodSymbol_idx" ON "MarketPriceHistory"("tradeGoodSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "MarketTransaction_waypointSymbol_shipSymbol_tradeSymbol_tim_key" ON "MarketTransaction"("waypointSymbol", "shipSymbol", "tradeSymbol", "timestamp");

-- AddForeignKey
ALTER TABLE "MarketPriceHistory" ADD CONSTRAINT "MarketPriceHistory_waypointSymbol_fkey" FOREIGN KEY ("waypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPriceHistory" ADD CONSTRAINT "MarketPriceHistory_tradeGoodSymbol_fkey" FOREIGN KEY ("tradeGoodSymbol") REFERENCES "TradeGood"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
