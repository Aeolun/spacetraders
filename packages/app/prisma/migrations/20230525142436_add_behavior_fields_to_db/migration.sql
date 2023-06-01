-- AlterTable
ALTER TABLE `Ship` ADD COLUMN `behaviorRange` INTEGER NULL,
    ADD COLUMN `currentBehavior` ENUM('TRADE', 'UPDATE_MARKETS', 'EXPLORE', 'MINE') NULL,
    ADD COLUMN `homeSystemSymbol` VARCHAR(191) NULL,
    ADD COLUMN `overalGoal` VARCHAR(191) NULL,
    ADD COLUMN `travelGoalSystemSymbol` VARCHAR(191) NULL;
