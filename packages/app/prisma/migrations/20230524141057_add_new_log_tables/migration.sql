-- CreateTable
CREATE TABLE `TradeLog` (
    `id` VARCHAR(191) NOT NULL,
    `shipSymbol` VARCHAR(191) NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `purchasePrice` INTEGER NULL,
    `purchaseAmount` INTEGER NULL,
    `purchasePriceAfter` INTEGER NULL,
    `sellPrice` INTEGER NULL,
    `sellAmount` INTEGER NULL,
    `sellPriceAfter` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TravelLog` (
    `id` VARCHAR(191) NOT NULL,
    `shipSymbol` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `cooldown` INTEGER NOT NULL,
    `flightDuration` INTEGER NOT NULL,
    `distance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
