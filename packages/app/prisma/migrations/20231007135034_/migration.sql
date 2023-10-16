/*
  Warnings:

  - A unique constraint covering the columns `[apiUrl]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Server_apiUrl_key" ON "Server"("apiUrl");
