-- CreateTable
CREATE TABLE `Leaderboard` (
    `agentSymbol` VARCHAR(191) NOT NULL,
    `reset` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `credits` INTEGER NOT NULL,
    `ships` INTEGER NOT NULL,

    UNIQUE INDEX `Leaderboard_agentSymbol_reset_dateTime_key`(`agentSymbol`, `reset`, `dateTime`),
    PRIMARY KEY (`agentSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
