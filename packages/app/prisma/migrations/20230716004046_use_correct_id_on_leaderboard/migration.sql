/*
  Warnings:

  - The primary key for the `Leaderboard` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX `Leaderboard_agentSymbol_reset_dateTime_key` ON `Leaderboard`;

-- AlterTable
ALTER TABLE `Leaderboard` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`agentSymbol`, `reset`, `dateTime`);
