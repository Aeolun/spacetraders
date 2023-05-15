/*
  Warnings:

  - Added the required column `crewRequirement` to the `ShipModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `powerRequirement` to the `ShipModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotRequirement` to the `ShipModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crewRequirement` to the `ShipMount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `powerRequirement` to the `ShipMount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotRequirement` to the `ShipMount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ShipModule` ADD COLUMN `crewRequirement` INTEGER NOT NULL,
    ADD COLUMN `powerRequirement` INTEGER NOT NULL,
    ADD COLUMN `slotRequirement` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ShipMount` ADD COLUMN `crewRequirement` INTEGER NOT NULL,
    ADD COLUMN `powerRequirement` INTEGER NOT NULL,
    ADD COLUMN `slotRequirement` INTEGER NOT NULL;
