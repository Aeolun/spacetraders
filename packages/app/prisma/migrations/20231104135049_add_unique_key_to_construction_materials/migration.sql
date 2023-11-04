/*
  Warnings:

  - A unique constraint covering the columns `[constructionId,tradeGoodSymbol]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Material_constructionId_tradeGoodSymbol_key" ON "Material"("constructionId", "tradeGoodSymbol");

-- AddForeignKey
ALTER TABLE "Construction" ADD CONSTRAINT "Construction_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
