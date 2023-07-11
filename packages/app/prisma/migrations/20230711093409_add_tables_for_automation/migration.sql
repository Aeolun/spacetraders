-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `automationStep` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `AutomationPlan` (
    `id` VARCHAR(191) NOT NULL,
    `agentSymbol` VARCHAR(191) NOT NULL,
    `action` ENUM('EXPAND_GROUP') NOT NULL,
    `step` INTEGER NOT NULL,
    `requiredCredits` INTEGER NOT NULL,
    `count` INTEGER NULL,
    `shipGroupSymbol` VARCHAR(191) NULL,

    INDEX `AutomationPlan_agentSymbol_idx`(`agentSymbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `agentSymbol` VARCHAR(191) NOT NULL,
    `shipConfigurationSymbol` VARCHAR(191) NULL,
    `behavior` ENUM('TRADE', 'UPDATE_MARKETS', 'EXPLORE_MARKETS', 'EXPLORE', 'MAP_JUMPGATE', 'MINE', 'TRAVEL') NOT NULL,

    INDEX `ShipGroup_agentSymbol_idx`(`agentSymbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
