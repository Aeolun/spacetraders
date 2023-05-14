-- CreateTable
CREATE TABLE `Agent` (
    `symbol` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL,
    `headquartersSymbol` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agent` ADD CONSTRAINT `Agent_headquartersSymbol_fkey` FOREIGN KEY (`headquartersSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;
