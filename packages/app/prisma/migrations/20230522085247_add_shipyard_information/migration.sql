-- CreateTable
CREATE TABLE `ShipConfiguration` (
    `symbol` VARCHAR(191) NOT NULL,
    `frameSymbol` VARCHAR(191) NOT NULL,
    `reactorSymbol` VARCHAR(191) NOT NULL,
    `engineSymbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipConfigurationModule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipConfigurationSymbol` VARCHAR(191) NOT NULL,
    `moduleSymbol` VARCHAR(191) NOT NULL,

    INDEX `ShipConfigurationModule_shipConfigurationSymbol_idx`(`shipConfigurationSymbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipConfigurationMount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipConfigurationSymbol` VARCHAR(191) NOT NULL,
    `mountSymbol` VARCHAR(191) NOT NULL,

    INDEX `ShipConfigurationMount_shipConfigurationSymbol_idx`(`shipConfigurationSymbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipyardModel` (
    `shipConfigurationSymbol` VARCHAR(191) NOT NULL,
    `waypointSymbol` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`shipConfigurationSymbol`, `waypointSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
