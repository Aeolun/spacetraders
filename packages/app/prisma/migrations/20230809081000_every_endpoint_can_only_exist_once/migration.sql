/*
  Warnings:

  - A unique constraint covering the columns `[endpoint]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Server_endpoint_key` ON `Server`(`endpoint`);
