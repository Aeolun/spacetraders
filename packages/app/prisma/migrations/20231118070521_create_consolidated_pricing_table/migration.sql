-- CreateTable
CREATE TABLE "ConsolidatedPrice" (
    "tradeGoodSymbol" TEXT NOT NULL,
    "systemSymbol" TEXT,
    "purchaseMaxPrice" INTEGER,
    "purchaseMinPrice" INTEGER,
    "purchaseAvgPrice" INTEGER,
    "purchaseMedianPrice" INTEGER,
    "purchaseStdDev" INTEGER,
    "purchaseP95" INTEGER,
    "purchaseP5" INTEGER,
    "sellMaxPrice" INTEGER,
    "sellMinPrice" INTEGER,
    "sellAvgPrice" INTEGER,
    "sellMedianPrice" INTEGER,
    "sellStdDev" INTEGER,
    "sellP95" INTEGER,
    "sellP5" INTEGER,
    "maxVolume" INTEGER,
    "minVolume" INTEGER,
    "importMarketCount" INTEGER,
    "exportMarketCount" INTEGER,
    "exchangeMarketCount" INTEGER,

    CONSTRAINT "ConsolidatedPrice_pkey" PRIMARY KEY ("tradeGoodSymbol")
);

-- AddForeignKey
ALTER TABLE "ConsolidatedPrice" ADD CONSTRAINT "ConsolidatedPrice_tradeGoodSymbol_fkey" FOREIGN KEY ("tradeGoodSymbol") REFERENCES "TradeGood"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsolidatedPrice" ADD CONSTRAINT "ConsolidatedPrice_systemSymbol_fkey" FOREIGN KEY ("systemSymbol") REFERENCES "System"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
