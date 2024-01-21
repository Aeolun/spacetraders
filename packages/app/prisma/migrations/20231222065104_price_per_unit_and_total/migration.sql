/*
  Warnings:

  - You are about to drop the column `price` on the `Ledger` table. All the data in the column will be lost.
  - Added the required column `pricePerUnit` to the `Ledger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "price",
ADD COLUMN     "pricePerUnit" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;
