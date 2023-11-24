/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "signature" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Survey_signature_key" ON "Survey"("signature");
