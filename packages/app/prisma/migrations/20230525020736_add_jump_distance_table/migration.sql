-- CreateTable
CREATE TABLE `JumpDistance` (
    `fromSystemSymbol` VARCHAR(191) NOT NULL,
    `toSystemSymbol` VARCHAR(191) NOT NULL,
    `jumps` INTEGER NOT NULL,
    `totalDistance` INTEGER NULL,

    PRIMARY KEY (`fromSystemSymbol`, `toSystemSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
