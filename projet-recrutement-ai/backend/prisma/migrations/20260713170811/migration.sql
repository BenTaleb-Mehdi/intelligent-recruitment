/*
  Warnings:

  - Added the required column `recruiterId` to the `job_offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job_offer` ADD COLUMN `recruiterId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `recruiter` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `teamSize` VARCHAR(191) NULL,
    `headquarters` VARCHAR(191) NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `recruiter_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recruiter` ADD CONSTRAINT `recruiter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_offer` ADD CONSTRAINT `job_offer_recruiterId_fkey` FOREIGN KEY (`recruiterId`) REFERENCES `recruiter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
