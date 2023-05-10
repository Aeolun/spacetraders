-- CreateTable
CREATE TABLE `Faction` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `headquartersSymbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FactionTrait` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orbital` (
    `symbol` VARCHAR(191) NOT NULL,
    `waypointSymbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sector` (
    `symbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `System` (
    `symbol` VARCHAR(191) NOT NULL,
    `type` ENUM('NEUTRON_STAR', 'RED_STAR', 'ORANGE_STAR', 'BLUE_STAR', 'YOUNG_STAR', 'WHITE_DWARF', 'BLACK_HOLE', 'HYPERGIANT', 'NEBULA', 'UNSTABLE') NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `factionSymbol` VARCHAR(191) NOT NULL,
    `sectorSymbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Waypoint` (
    `symbol` VARCHAR(191) NOT NULL,
    `type` ENUM('PLANET', 'GAS_GIANT', 'MOON', 'ORBITAL_STATION', 'JUMP_GATE', 'ASTEROID_FIELD', 'NEBULA', 'DEBRIS_FIELD', 'GRAVITY_WELL') NOT NULL,
    `systemSymbol` VARCHAR(191) NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `factionSymbol` VARCHAR(191) NOT NULL,
    `chartSymbol` VARCHAR(191) NOT NULL,
    `chartSubmittedBy` VARCHAR(191) NOT NULL,
    `chartSubmittedOn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaypointTrait` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TradeGood` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipCargo` (
    `shipSymbol` VARCHAR(191) NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `units` INTEGER NOT NULL,

    PRIMARY KEY (`shipSymbol`, `tradeGoodSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ship` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `factionSymbol` VARCHAR(191) NOT NULL,
    `role` ENUM('FABRICATOR', 'HARVESTER', 'HAULER', 'INTERCEPTOR', 'EXCAVATOR', 'TRANSPORT', 'REPAIR', 'SURVEYOR', 'COMMAND', 'CARRIER', 'PATROL', 'SATELLITE', 'EXPLORER', 'REFINERY') NOT NULL,
    `currentSystemSymbol` VARCHAR(191) NOT NULL,
    `currentWaypointSymbol` VARCHAR(191) NOT NULL,
    `destinationWaypointSymbol` VARCHAR(191) NULL,
    `departureOn` DATETIME(3) NULL,
    `arrivalOn` DATETIME(3) NULL,
    `navStatus` ENUM('IN_TRANSIT', 'IN_ORBIT', 'DOCKED') NOT NULL,
    `flightMode` ENUM('DRIFT', 'STEALTH', 'CRUISE', 'BURN') NOT NULL,
    `cargoCapacity` INTEGER NOT NULL,
    `cargoUsed` INTEGER NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FactionToFactionTrait` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FactionToFactionTrait_AB_unique`(`A`, `B`),
    INDEX `_FactionToFactionTrait_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_WaypointToWaypointTrait` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_WaypointToWaypointTrait_AB_unique`(`A`, `B`),
    INDEX `_WaypointToWaypointTrait_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Faction` ADD CONSTRAINT `Faction_headquartersSymbol_fkey` FOREIGN KEY (`headquartersSymbol`) REFERENCES `System`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orbital` ADD CONSTRAINT `Orbital_waypointSymbol_fkey` FOREIGN KEY (`waypointSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `System` ADD CONSTRAINT `System_sectorSymbol_fkey` FOREIGN KEY (`sectorSymbol`) REFERENCES `Sector`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `System` ADD CONSTRAINT `System_factionSymbol_fkey` FOREIGN KEY (`factionSymbol`) REFERENCES `Faction`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Waypoint` ADD CONSTRAINT `Waypoint_systemSymbol_fkey` FOREIGN KEY (`systemSymbol`) REFERENCES `System`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Waypoint` ADD CONSTRAINT `Waypoint_factionSymbol_fkey` FOREIGN KEY (`factionSymbol`) REFERENCES `Faction`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipCargo` ADD CONSTRAINT `ShipCargo_shipSymbol_fkey` FOREIGN KEY (`shipSymbol`) REFERENCES `Ship`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipCargo` ADD CONSTRAINT `ShipCargo_tradeGoodSymbol_fkey` FOREIGN KEY (`tradeGoodSymbol`) REFERENCES `TradeGood`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_currentSystemSymbol_fkey` FOREIGN KEY (`currentSystemSymbol`) REFERENCES `System`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_currentWaypointSymbol_fkey` FOREIGN KEY (`currentWaypointSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ship` ADD CONSTRAINT `Ship_destinationWaypointSymbol_fkey` FOREIGN KEY (`destinationWaypointSymbol`) REFERENCES `Waypoint`(`symbol`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FactionToFactionTrait` ADD CONSTRAINT `_FactionToFactionTrait_A_fkey` FOREIGN KEY (`A`) REFERENCES `Faction`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FactionToFactionTrait` ADD CONSTRAINT `_FactionToFactionTrait_B_fkey` FOREIGN KEY (`B`) REFERENCES `FactionTrait`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WaypointToWaypointTrait` ADD CONSTRAINT `_WaypointToWaypointTrait_A_fkey` FOREIGN KEY (`A`) REFERENCES `Waypoint`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WaypointToWaypointTrait` ADD CONSTRAINT `_WaypointToWaypointTrait_B_fkey` FOREIGN KEY (`B`) REFERENCES `WaypointTrait`(`symbol`) ON DELETE CASCADE ON UPDATE CASCADE;
