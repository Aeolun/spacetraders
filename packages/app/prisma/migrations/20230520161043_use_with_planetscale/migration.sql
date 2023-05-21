-- CreateTable
CREATE TABLE `Server` (
    `resetDate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`resetDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faction` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `headquartersSymbol` VARCHAR(191) NULL,

    INDEX `Faction_headquartersSymbol_idx`(`headquartersSymbol`),
    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `symbol` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL,
    `headquartersSymbol` VARCHAR(191) NULL,
    `accountId` VARCHAR(191) NOT NULL,

    INDEX `Agent_headquartersSymbol_idx`(`headquartersSymbol`),
    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FactionTrait` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

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
    `sectorSymbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `type` ENUM('NEUTRON_STAR', 'RED_STAR', 'ORANGE_STAR', 'BLUE_STAR', 'YOUNG_STAR', 'WHITE_DWARF', 'BLACK_HOLE', 'HYPERGIANT', 'NEBULA', 'UNSTABLE') NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `waypointsRetrieved` BOOLEAN NOT NULL DEFAULT false,

    INDEX `System_sectorSymbol_idx`(`sectorSymbol`),
    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Waypoint` (
    `symbol` VARCHAR(191) NOT NULL,
    `type` ENUM('PLANET', 'GAS_GIANT', 'MOON', 'ORBITAL_STATION', 'JUMP_GATE', 'ASTEROID_FIELD', 'NEBULA', 'DEBRIS_FIELD', 'GRAVITY_WELL') NOT NULL,
    `systemSymbol` VARCHAR(191) NOT NULL,
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `factionSymbol` VARCHAR(191) NULL,
    `orbitsSymbol` VARCHAR(191) NULL,
    `chartSymbol` VARCHAR(191) NULL,
    `chartSubmittedBy` VARCHAR(191) NULL,
    `chartSubmittedOn` DATETIME(3) NULL,

    INDEX `Waypoint_orbitsSymbol_idx`(`orbitsSymbol`),
    INDEX `Waypoint_systemSymbol_idx`(`systemSymbol`),
    INDEX `Waypoint_factionSymbol_idx`(`factionSymbol`),
    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaypointTrait` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarketPrice` (
    `waypointSymbol` VARCHAR(191) NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `supply` VARCHAR(191) NOT NULL,
    `purchasePrice` INTEGER NOT NULL,
    `sellPrice` INTEGER NOT NULL,
    `tradeVolume` INTEGER NOT NULL,
    `updatedOn` DATETIME(3) NOT NULL,

    INDEX `MarketPrice_waypointSymbol_idx`(`waypointSymbol`),
    INDEX `MarketPrice_tradeGoodSymbol_idx`(`tradeGoodSymbol`),
    PRIMARY KEY (`waypointSymbol`, `tradeGoodSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TradeGood` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipCargo` (
    `shipSymbol` VARCHAR(191) NOT NULL,
    `tradeGoodSymbol` VARCHAR(191) NOT NULL,
    `units` INTEGER NOT NULL,

    INDEX `ShipCargo_tradeGoodSymbol_idx`(`tradeGoodSymbol`),
    INDEX `ShipCargo_shipSymbol_idx`(`shipSymbol`),
    PRIMARY KEY (`shipSymbol`, `tradeGoodSymbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipFrame` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `moduleSlots` INTEGER NULL,
    `mountingPoints` INTEGER NULL,
    `fuelCapacity` INTEGER NULL,
    `crewRequirement` INTEGER NULL,
    `powerRequirement` INTEGER NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipReactor` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `powerOutput` INTEGER NULL,
    `crewRequirement` INTEGER NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipEngine` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `speed` INTEGER NULL,
    `crewRequirement` INTEGER NULL,
    `powerRequirement` INTEGER NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipModule` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `effectName` VARCHAR(191) NULL,
    `value` INTEGER NULL,
    `crewRequirement` INTEGER NULL,
    `powerRequirement` INTEGER NULL,
    `slotRequirement` INTEGER NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipMount` (
    `symbol` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `effectName` VARCHAR(191) NULL,
    `value` INTEGER NULL,
    `worksOn` TEXT NULL,
    `crewRequirement` INTEGER NULL,
    `powerRequirement` INTEGER NULL,
    `slotRequirement` INTEGER NULL,

    PRIMARY KEY (`symbol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ship` (
    `symbol` VARCHAR(191) NOT NULL,
    `agent` VARCHAR(191) NOT NULL DEFAULT 'PHANTASM',
    `name` VARCHAR(191) NOT NULL,
    `factionSymbol` VARCHAR(191) NOT NULL,
    `role` ENUM('FABRICATOR', 'HARVESTER', 'HAULER', 'INTERCEPTOR', 'EXCAVATOR', 'TRANSPORT', 'REPAIR', 'SURVEYOR', 'COMMAND', 'CARRIER', 'PATROL', 'SATELLITE', 'EXPLORER', 'REFINERY') NOT NULL,
    `currentSystemSymbol` VARCHAR(191) NOT NULL,
    `currentWaypointSymbol` VARCHAR(191) NOT NULL,
    `destinationWaypointSymbol` VARCHAR(191) NULL,
    `departureWaypointSymbol` VARCHAR(191) NULL,
    `departureOn` DATETIME(3) NULL,
    `arrivalOn` DATETIME(3) NULL,
    `navStatus` ENUM('IN_TRANSIT', 'IN_ORBIT', 'DOCKED') NOT NULL,
    `flightMode` ENUM('DRIFT', 'STEALTH', 'CRUISE', 'BURN') NOT NULL,
    `reactorCooldownOn` DATETIME(3) NULL,
    `fuelCapacity` INTEGER NOT NULL DEFAULT 0,
    `fuelAvailable` INTEGER NOT NULL DEFAULT 0,
    `cargoCapacity` INTEGER NULL,
    `cargoUsed` INTEGER NULL,
    `frameSymbol` VARCHAR(191) NOT NULL,
    `reactorSymbol` VARCHAR(191) NOT NULL,
    `engineSymbol` VARCHAR(191) NOT NULL,

    INDEX `Ship_currentSystemSymbol_idx`(`currentSystemSymbol`),
    INDEX `Ship_currentWaypointSymbol_idx`(`currentWaypointSymbol`),
    INDEX `Ship_destinationWaypointSymbol_idx`(`destinationWaypointSymbol`),
    INDEX `Ship_departureWaypointSymbol_idx`(`departureWaypointSymbol`),
    INDEX `Ship_frameSymbol_idx`(`frameSymbol`),
    INDEX `Ship_reactorSymbol_idx`(`reactorSymbol`),
    INDEX `Ship_engineSymbol_idx`(`engineSymbol`),
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
CREATE TABLE `_FactionToSystem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FactionToSystem_AB_unique`(`A`, `B`),
    INDEX `_FactionToSystem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_WaypointToWaypointTrait` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_WaypointToWaypointTrait_AB_unique`(`A`, `B`),
    INDEX `_WaypointToWaypointTrait_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ShipToShipModule` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ShipToShipModule_AB_unique`(`A`, `B`),
    INDEX `_ShipToShipModule_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ShipToShipMount` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ShipToShipMount_AB_unique`(`A`, `B`),
    INDEX `_ShipToShipMount_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
