-- CreateEnum
CREATE TYPE "SystemType" AS ENUM ('NEUTRON_STAR', 'RED_STAR', 'ORANGE_STAR', 'BLUE_STAR', 'YOUNG_STAR', 'WHITE_DWARF', 'BLACK_HOLE', 'HYPERGIANT', 'NEBULA', 'UNSTABLE');

-- CreateEnum
CREATE TYPE "AutomationAction" AS ENUM ('EXPAND_GROUP');

-- CreateEnum
CREATE TYPE "WaypointType" AS ENUM ('PLANET', 'GAS_GIANT', 'MOON', 'ORBITAL_STATION', 'JUMP_GATE', 'ASTEROID_FIELD', 'NEBULA', 'DEBRIS_FIELD', 'GRAVITY_WELL');

-- CreateEnum
CREATE TYPE "ShipRole" AS ENUM ('FABRICATOR', 'HARVESTER', 'HAULER', 'INTERCEPTOR', 'EXCAVATOR', 'TRANSPORT', 'REPAIR', 'SURVEYOR', 'COMMAND', 'CARRIER', 'PATROL', 'SATELLITE', 'EXPLORER', 'REFINERY');

-- CreateEnum
CREATE TYPE "ShipNavStatus" AS ENUM ('IN_TRANSIT', 'IN_ORBIT', 'DOCKED');

-- CreateEnum
CREATE TYPE "ShipNavFlightMode" AS ENUM ('DRIFT', 'STEALTH', 'CRUISE', 'BURN');

-- CreateEnum
CREATE TYPE "MarketGoodKind" AS ENUM ('IMPORT', 'EXPORT', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "ShipBehavior" AS ENUM ('TRADE', 'UPDATE_MARKETS', 'EXPLORE_MARKETS', 'EXPLORE', 'MAP_JUMPGATE', 'MINE', 'TRAVEL');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('PROCUREMENT');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "resetDate" TEXT NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "headquartersSymbol" TEXT,
    "color" TEXT,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "reset" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "headquartersSymbol" TEXT,
    "accountId" TEXT NOT NULL,
    "token" TEXT,
    "automationStep" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "currentAgentId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactionTrait" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FactionTrait_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Sector" (
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "agentSymbol" TEXT NOT NULL,
    "reset" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "credits" INTEGER NOT NULL,
    "ships" INTEGER NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("agentSymbol","reset","dateTime")
);

-- CreateTable
CREATE TABLE "System" (
    "symbol" TEXT NOT NULL,
    "sectorSymbol" TEXT NOT NULL,
    "name" TEXT,
    "type" "SystemType" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "hasJumpGate" BOOLEAN NOT NULL DEFAULT false,
    "jumpgateRange" INTEGER,
    "hasMarket" BOOLEAN NOT NULL DEFAULT false,
    "hasFuel" BOOLEAN NOT NULL DEFAULT false,
    "hasShipyard" BOOLEAN NOT NULL DEFAULT false,
    "hasBelt" BOOLEAN NOT NULL DEFAULT false,
    "hasUncharted" BOOLEAN NOT NULL DEFAULT false,
    "hasStation" BOOLEAN NOT NULL DEFAULT false,
    "majorityFaction" TEXT,
    "waypointsRetrieved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "System_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "AutomationPlan" (
    "id" TEXT NOT NULL,
    "agentSymbol" TEXT NOT NULL,
    "action" "AutomationAction" NOT NULL,
    "step" INTEGER NOT NULL,
    "requiredCredits" INTEGER NOT NULL,
    "count" INTEGER,
    "shipGroupSymbol" TEXT,

    CONSTRAINT "AutomationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agentSymbol" TEXT NOT NULL,
    "shipConfigurationSymbol" TEXT,
    "behavior" "ShipBehavior" NOT NULL,

    CONSTRAINT "ShipGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipLog" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeLog" (
    "id" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "purchaseWaypointSymbol" TEXT,
    "sellWaypointSymbol" TEXT,
    "purchasePrice" INTEGER,
    "purchaseAmount" INTEGER,
    "purchasePriceAfter" INTEGER,
    "purchaseVolume" INTEGER,
    "sellPrice" INTEGER,
    "sellAmount" INTEGER,
    "sellPriceAfter" INTEGER,
    "sellVolume" INTEGER,
    "tradeVolume" INTEGER NOT NULL,
    "fuelCost" INTEGER,
    "supply" TEXT NOT NULL,
    "supplyAfter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentTrade" TEXT,

    CONSTRAINT "TradeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelLog" (
    "id" TEXT NOT NULL,
    "fromSystemSymbol" TEXT NOT NULL,
    "toSystemSymbol" TEXT NOT NULL,
    "fromWaypoint" TEXT NOT NULL,
    "toWaypoint" TEXT NOT NULL,
    "shipSymbol" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "flightMode" "ShipNavFlightMode" NOT NULL,
    "engineSpeed" INTEGER NOT NULL,
    "fuelConsumed" INTEGER NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "flightDuration" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waypoint" (
    "symbol" TEXT NOT NULL,
    "type" "WaypointType" NOT NULL,
    "systemSymbol" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "factionSymbol" TEXT,
    "orbitsSymbol" TEXT,
    "chartSymbol" TEXT,
    "chartSubmittedBy" TEXT,
    "chartSubmittedOn" TIMESTAMP(3),

    CONSTRAINT "Waypoint_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipConfiguration" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frameSymbol" TEXT NOT NULL,
    "reactorSymbol" TEXT NOT NULL,
    "engineSymbol" TEXT NOT NULL,

    CONSTRAINT "ShipConfiguration_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipConfigurationModule" (
    "id" SERIAL NOT NULL,
    "shipConfigurationSymbol" TEXT NOT NULL,
    "moduleSymbol" TEXT NOT NULL,

    CONSTRAINT "ShipConfigurationModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipConfigurationMount" (
    "id" SERIAL NOT NULL,
    "shipConfigurationSymbol" TEXT NOT NULL,
    "mountSymbol" TEXT NOT NULL,

    CONSTRAINT "ShipConfigurationMount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipyardModel" (
    "shipConfigurationSymbol" TEXT NOT NULL,
    "waypointSymbol" TEXT NOT NULL,
    "price" INTEGER,

    CONSTRAINT "ShipyardModel_pkey" PRIMARY KEY ("shipConfigurationSymbol","waypointSymbol")
);

-- CreateTable
CREATE TABLE "WaypointTrait" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "WaypointTrait_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Jumpgate" (
    "waypointSymbol" TEXT NOT NULL,
    "range" INTEGER NOT NULL,

    CONSTRAINT "Jumpgate_pkey" PRIMARY KEY ("waypointSymbol")
);

-- CreateTable
CREATE TABLE "JumpConnectedSystem" (
    "fromWaypointSymbol" TEXT NOT NULL,
    "toWaypointSymbol" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,

    CONSTRAINT "JumpConnectedSystem_pkey" PRIMARY KEY ("fromWaypointSymbol","toWaypointSymbol")
);

-- CreateTable
CREATE TABLE "JumpDistance" (
    "fromSystemSymbol" TEXT NOT NULL,
    "toSystemSymbol" TEXT NOT NULL,
    "jumps" INTEGER NOT NULL,
    "totalDistance" INTEGER,

    CONSTRAINT "JumpDistance_pkey" PRIMARY KEY ("fromSystemSymbol","toSystemSymbol")
);

-- CreateTable
CREATE TABLE "MarketPrice" (
    "waypointSymbol" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "kind" "MarketGoodKind" NOT NULL,
    "supply" TEXT,
    "purchasePrice" INTEGER,
    "sellPrice" INTEGER,
    "tradeVolume" INTEGER,
    "updatedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("waypointSymbol","tradeGoodSymbol")
);

-- CreateTable
CREATE TABLE "TradeGood" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TradeGood_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipCargo" (
    "shipSymbol" TEXT NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "units" INTEGER NOT NULL,

    CONSTRAINT "ShipCargo_pkey" PRIMARY KEY ("shipSymbol","tradeGoodSymbol")
);

-- CreateTable
CREATE TABLE "ShipFrame" (
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "moduleSlots" INTEGER,
    "mountingPoints" INTEGER,
    "fuelCapacity" INTEGER,
    "crewRequirement" INTEGER,
    "powerRequirement" INTEGER,

    CONSTRAINT "ShipFrame_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipReactor" (
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "powerOutput" INTEGER,
    "crewRequirement" INTEGER,

    CONSTRAINT "ShipReactor_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipEngine" (
    "symbol" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "speed" INTEGER,
    "crewRequirement" INTEGER,
    "powerRequirement" INTEGER,

    CONSTRAINT "ShipEngine_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipModule" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effectName" TEXT,
    "value" INTEGER,
    "crewRequirement" INTEGER,
    "powerRequirement" INTEGER,
    "slotRequirement" INTEGER,

    CONSTRAINT "ShipModule_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "ShipMount" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "effectName" TEXT,
    "value" INTEGER,
    "worksOn" TEXT,
    "crewRequirement" INTEGER,
    "powerRequirement" INTEGER,
    "slotRequirement" INTEGER,

    CONSTRAINT "ShipMount_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Ship" (
    "symbol" TEXT NOT NULL,
    "agent" TEXT NOT NULL DEFAULT 'PHANTASM',
    "name" TEXT NOT NULL,
    "factionSymbol" TEXT NOT NULL,
    "role" "ShipRole" NOT NULL,
    "currentSystemSymbol" TEXT NOT NULL,
    "currentWaypointSymbol" TEXT NOT NULL,
    "destinationWaypointSymbol" TEXT,
    "departureWaypointSymbol" TEXT,
    "departureOn" TIMESTAMP(3),
    "arrivalOn" TIMESTAMP(3),
    "navStatus" "ShipNavStatus" NOT NULL,
    "flightMode" "ShipNavFlightMode" NOT NULL,
    "reactorCooldownOn" TIMESTAMP(3),
    "fuelCapacity" INTEGER NOT NULL DEFAULT 0,
    "fuelAvailable" INTEGER NOT NULL DEFAULT 0,
    "cargoCapacity" INTEGER,
    "cargoUsed" INTEGER,
    "frameSymbol" TEXT NOT NULL,
    "reactorSymbol" TEXT NOT NULL,
    "engineSymbol" TEXT NOT NULL,
    "currentBehavior" "ShipBehavior",
    "homeSystemSymbol" TEXT,
    "behaviorRange" INTEGER,
    "behaviorOnce" BOOLEAN,
    "travelGoalSystemSymbol" TEXT,
    "overalGoal" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "agentSymbol" TEXT NOT NULL,
    "factionSymbol" TEXT NOT NULL,
    "type" "ContractType" NOT NULL,
    "deadlineToAccept" TIMESTAMP(3) NOT NULL,
    "paymentOnAccepted" INTEGER NOT NULL,
    "paymentOnFulfilled" INTEGER NOT NULL,
    "tradeGoodSymbol" TEXT NOT NULL,
    "destinationWaypointSymbol" TEXT NOT NULL,
    "unitsRequired" INTEGER NOT NULL,
    "unitsFulfilled" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "fulfilled" BOOLEAN NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FactionToFactionTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_WaypointToWaypointTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShipToShipModule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ShipToShipMount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_endpoint_key" ON "Server"("endpoint");

-- CreateIndex
CREATE INDEX "Faction_headquartersSymbol_idx" ON "Faction"("headquartersSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_symbol_reset_server_key" ON "Agent"("symbol", "reset", "server");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_currentAgentId_idx" ON "Account"("currentAgentId");

-- CreateIndex
CREATE INDEX "System_sectorSymbol_idx" ON "System"("sectorSymbol");

-- CreateIndex
CREATE INDEX "AutomationPlan_agentSymbol_idx" ON "AutomationPlan"("agentSymbol");

-- CreateIndex
CREATE INDEX "AutomationPlan_shipGroupSymbol_idx" ON "AutomationPlan"("shipGroupSymbol");

-- CreateIndex
CREATE INDEX "ShipGroup_agentSymbol_idx" ON "ShipGroup"("agentSymbol");

-- CreateIndex
CREATE INDEX "ShipGroup_shipConfigurationSymbol_idx" ON "ShipGroup"("shipConfigurationSymbol");

-- CreateIndex
CREATE INDEX "ShipLog_symbol_createdAt_idx" ON "ShipLog"("symbol", "createdAt");

-- CreateIndex
CREATE INDEX "TradeLog_shipSymbol_createdAt_idx" ON "TradeLog"("shipSymbol", "createdAt");

-- CreateIndex
CREATE INDEX "TradeLog_tradeGoodSymbol_createdAt_idx" ON "TradeLog"("tradeGoodSymbol", "createdAt");

-- CreateIndex
CREATE INDEX "TravelLog_shipSymbol_createdAt_idx" ON "TravelLog"("shipSymbol", "createdAt");

-- CreateIndex
CREATE INDEX "Waypoint_orbitsSymbol_idx" ON "Waypoint"("orbitsSymbol");

-- CreateIndex
CREATE INDEX "Waypoint_systemSymbol_idx" ON "Waypoint"("systemSymbol");

-- CreateIndex
CREATE INDEX "Waypoint_factionSymbol_idx" ON "Waypoint"("factionSymbol");

-- CreateIndex
CREATE INDEX "ShipConfigurationModule_shipConfigurationSymbol_idx" ON "ShipConfigurationModule"("shipConfigurationSymbol");

-- CreateIndex
CREATE INDEX "ShipConfigurationMount_shipConfigurationSymbol_idx" ON "ShipConfigurationMount"("shipConfigurationSymbol");

-- CreateIndex
CREATE INDEX "ShipyardModel_shipConfigurationSymbol_idx" ON "ShipyardModel"("shipConfigurationSymbol");

-- CreateIndex
CREATE INDEX "Jumpgate_waypointSymbol_idx" ON "Jumpgate"("waypointSymbol");

-- CreateIndex
CREATE INDEX "JumpConnectedSystem_fromWaypointSymbol_idx" ON "JumpConnectedSystem"("fromWaypointSymbol");

-- CreateIndex
CREATE INDEX "JumpConnectedSystem_toWaypointSymbol_idx" ON "JumpConnectedSystem"("toWaypointSymbol");

-- CreateIndex
CREATE INDEX "MarketPrice_waypointSymbol_idx" ON "MarketPrice"("waypointSymbol");

-- CreateIndex
CREATE INDEX "MarketPrice_tradeGoodSymbol_idx" ON "MarketPrice"("tradeGoodSymbol");

-- CreateIndex
CREATE INDEX "ShipCargo_tradeGoodSymbol_idx" ON "ShipCargo"("tradeGoodSymbol");

-- CreateIndex
CREATE INDEX "ShipCargo_shipSymbol_idx" ON "ShipCargo"("shipSymbol");

-- CreateIndex
CREATE INDEX "Ship_currentSystemSymbol_idx" ON "Ship"("currentSystemSymbol");

-- CreateIndex
CREATE INDEX "Ship_currentWaypointSymbol_idx" ON "Ship"("currentWaypointSymbol");

-- CreateIndex
CREATE INDEX "Ship_destinationWaypointSymbol_idx" ON "Ship"("destinationWaypointSymbol");

-- CreateIndex
CREATE INDEX "Ship_departureWaypointSymbol_idx" ON "Ship"("departureWaypointSymbol");

-- CreateIndex
CREATE INDEX "Ship_frameSymbol_idx" ON "Ship"("frameSymbol");

-- CreateIndex
CREATE INDEX "Ship_reactorSymbol_idx" ON "Ship"("reactorSymbol");

-- CreateIndex
CREATE INDEX "Ship_engineSymbol_idx" ON "Ship"("engineSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "_FactionToFactionTrait_AB_unique" ON "_FactionToFactionTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_FactionToFactionTrait_B_index" ON "_FactionToFactionTrait"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WaypointToWaypointTrait_AB_unique" ON "_WaypointToWaypointTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_WaypointToWaypointTrait_B_index" ON "_WaypointToWaypointTrait"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShipToShipModule_AB_unique" ON "_ShipToShipModule"("A", "B");

-- CreateIndex
CREATE INDEX "_ShipToShipModule_B_index" ON "_ShipToShipModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShipToShipMount_AB_unique" ON "_ShipToShipMount"("A", "B");

-- CreateIndex
CREATE INDEX "_ShipToShipMount_B_index" ON "_ShipToShipMount"("B");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_headquartersSymbol_fkey" FOREIGN KEY ("headquartersSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_currentAgentId_fkey" FOREIGN KEY ("currentAgentId") REFERENCES "Agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "System" ADD CONSTRAINT "System_sectorSymbol_fkey" FOREIGN KEY ("sectorSymbol") REFERENCES "Sector"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationPlan" ADD CONSTRAINT "AutomationPlan_agentSymbol_fkey" FOREIGN KEY ("agentSymbol") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationPlan" ADD CONSTRAINT "AutomationPlan_shipGroupSymbol_fkey" FOREIGN KEY ("shipGroupSymbol") REFERENCES "ShipGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipGroup" ADD CONSTRAINT "ShipGroup_agentSymbol_fkey" FOREIGN KEY ("agentSymbol") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipGroup" ADD CONSTRAINT "ShipGroup_shipConfigurationSymbol_fkey" FOREIGN KEY ("shipConfigurationSymbol") REFERENCES "ShipConfiguration"("symbol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_systemSymbol_fkey" FOREIGN KEY ("systemSymbol") REFERENCES "System"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_orbitsSymbol_fkey" FOREIGN KEY ("orbitsSymbol") REFERENCES "Waypoint"("symbol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ShipConfigurationModule" ADD CONSTRAINT "ShipConfigurationModule_shipConfigurationSymbol_fkey" FOREIGN KEY ("shipConfigurationSymbol") REFERENCES "ShipConfiguration"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipConfigurationMount" ADD CONSTRAINT "ShipConfigurationMount_shipConfigurationSymbol_fkey" FOREIGN KEY ("shipConfigurationSymbol") REFERENCES "ShipConfiguration"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipyardModel" ADD CONSTRAINT "ShipyardModel_shipConfigurationSymbol_fkey" FOREIGN KEY ("shipConfigurationSymbol") REFERENCES "ShipConfiguration"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jumpgate" ADD CONSTRAINT "Jumpgate_waypointSymbol_fkey" FOREIGN KEY ("waypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JumpConnectedSystem" ADD CONSTRAINT "JumpConnectedSystem_fromWaypointSymbol_fkey" FOREIGN KEY ("fromWaypointSymbol") REFERENCES "Jumpgate"("waypointSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JumpConnectedSystem" ADD CONSTRAINT "JumpConnectedSystem_toWaypointSymbol_fkey" FOREIGN KEY ("toWaypointSymbol") REFERENCES "Jumpgate"("waypointSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_waypointSymbol_fkey" FOREIGN KEY ("waypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_tradeGoodSymbol_fkey" FOREIGN KEY ("tradeGoodSymbol") REFERENCES "TradeGood"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipCargo" ADD CONSTRAINT "ShipCargo_shipSymbol_fkey" FOREIGN KEY ("shipSymbol") REFERENCES "Ship"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipCargo" ADD CONSTRAINT "ShipCargo_tradeGoodSymbol_fkey" FOREIGN KEY ("tradeGoodSymbol") REFERENCES "TradeGood"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_currentSystemSymbol_fkey" FOREIGN KEY ("currentSystemSymbol") REFERENCES "System"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_currentWaypointSymbol_fkey" FOREIGN KEY ("currentWaypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_destinationWaypointSymbol_fkey" FOREIGN KEY ("destinationWaypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_departureWaypointSymbol_fkey" FOREIGN KEY ("departureWaypointSymbol") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_frameSymbol_fkey" FOREIGN KEY ("frameSymbol") REFERENCES "ShipFrame"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_reactorSymbol_fkey" FOREIGN KEY ("reactorSymbol") REFERENCES "ShipReactor"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_engineSymbol_fkey" FOREIGN KEY ("engineSymbol") REFERENCES "ShipEngine"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactionToFactionTrait" ADD CONSTRAINT "_FactionToFactionTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Faction"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FactionToFactionTrait" ADD CONSTRAINT "_FactionToFactionTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "FactionTrait"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaypointToWaypointTrait" ADD CONSTRAINT "_WaypointToWaypointTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Waypoint"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WaypointToWaypointTrait" ADD CONSTRAINT "_WaypointToWaypointTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "WaypointTrait"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShipToShipModule" ADD CONSTRAINT "_ShipToShipModule_A_fkey" FOREIGN KEY ("A") REFERENCES "Ship"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShipToShipModule" ADD CONSTRAINT "_ShipToShipModule_B_fkey" FOREIGN KEY ("B") REFERENCES "ShipModule"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShipToShipMount" ADD CONSTRAINT "_ShipToShipMount_A_fkey" FOREIGN KEY ("A") REFERENCES "Ship"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShipToShipMount" ADD CONSTRAINT "_ShipToShipMount_B_fkey" FOREIGN KEY ("B") REFERENCES "ShipMount"("symbol") ON DELETE CASCADE ON UPDATE CASCADE;
