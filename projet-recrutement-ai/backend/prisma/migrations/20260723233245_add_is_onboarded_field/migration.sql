-- AlterTable
ALTER TABLE `user` ADD COLUMN `isOnboarded` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `verification` MODIFY `identifier` TEXT NOT NULL,
    MODIFY `value` TEXT NOT NULL;
