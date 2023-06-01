-- CreateTable
CREATE TABLE `Jumpgate` (
    `waypointSymbol` VARCHAR(191) NOT NULL,
    `range` INTEGER NOT NULL,

    INDEX `Jumpgate_waypointSymbol_idx`(`waypointSymbol`),
    PRIMARY KEY (`waypointSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JumpConnectedSystem` (
    `fromWaypointSymbol` VARCHAR(191) NOT NULL,
    `toWaypointSymbol` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,

    INDEX `JumpConnectedSystem_fromWaypointSymbol_idx`(`fromWaypointSymbol`),
    INDEX `JumpConnectedSystem_toWaypointSymbol_idx`(`toWaypointSymbol`),
    PRIMARY KEY (`fromWaypointSymbol`, `toWaypointSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
