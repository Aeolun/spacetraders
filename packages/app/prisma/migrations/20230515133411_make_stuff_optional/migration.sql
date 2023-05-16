-- AlterTable
ALTER TABLE `ShipEngine` MODIFY `crewRequirement` INTEGER NULL,
    MODIFY `powerRequirement` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipFrame` MODIFY `crewRequirement` INTEGER NULL,
    MODIFY `powerRequirement` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipModule` MODIFY `crewRequirement` INTEGER NULL,
    MODIFY `powerRequirement` INTEGER NULL,
    MODIFY `slotRequirement` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipMount` MODIFY `crewRequirement` INTEGER NULL,
    MODIFY `powerRequirement` INTEGER NULL,
    MODIFY `slotRequirement` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShipReactor` MODIFY `crewRequirement` INTEGER NULL;
