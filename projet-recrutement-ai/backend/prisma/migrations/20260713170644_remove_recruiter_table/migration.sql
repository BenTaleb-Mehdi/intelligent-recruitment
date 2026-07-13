/*
  Warnings:

  - You are about to drop the column `recruiterId` on the `job_offer` table. All the data in the column will be lost.
  - You are about to drop the `recruiter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `job_offer` DROP FOREIGN KEY `job_offer_recruiterId_fkey`;

-- DropForeignKey
ALTER TABLE `recruiter` DROP FOREIGN KEY `recruiter_userId_fkey`;

-- DropIndex
DROP INDEX `job_offer_recruiterId_fkey` ON `job_offer`;

-- AlterTable
ALTER TABLE `job_offer` DROP COLUMN `recruiterId`;

-- DropTable
DROP TABLE `recruiter`;
