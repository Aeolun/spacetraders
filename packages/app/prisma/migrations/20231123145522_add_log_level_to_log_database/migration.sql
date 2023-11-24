-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- AlterTable
ALTER TABLE "ShipLog" ADD COLUMN     "level" "LogLevel" NOT NULL DEFAULT 'INFO';
