-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `token` TEXT NULL;

-- CreateTable
CREATE TABLE `Contract` (
    `id` VARCHAR(191) NOT NULL,
    `agentSymbol` VARCHAR(191) NOT NULL,
    `factionSymbol` VARCHAR(191) NOT NULL,
    `type` ENUM('PROCUREMENT') NOT NULL,
    `deadlineToAccept` DATETIME(3) NOT NULL,
    `paymentOnAccepted` INTEGER NOT NULL,
    `paymentOnFulfilled` INTEGER NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `destinationWaypointSymbol` VARCHAR(191) NOT NULL,
    `unitsRequired` INTEGER NOT NULL,
    `unitsFulfilled` INTEGER NOT NULL,
    `accepted` BOOLEAN NOT NULL,
    `fulfilled` BOOLEAN NOT NULL,
    `expiration` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
