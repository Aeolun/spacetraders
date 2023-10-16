/*
  Warnings:

  - You are about to drop the column `server` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[symbol,reset]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Agent_symbol_reset_server_key";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "server";

-- DropTable
DROP TABLE "Server";

-- CreateIndex
CREATE UNIQUE INDEX "Agent_symbol_reset_key" ON "Agent"("symbol", "reset");
