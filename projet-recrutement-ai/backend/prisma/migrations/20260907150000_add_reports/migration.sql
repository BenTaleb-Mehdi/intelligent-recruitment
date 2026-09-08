-- Persist user reports submitted by candidates/recruiters for admin moderation.
CREATE TABLE `report` (
    `id` VARCHAR(191) NOT NULL,
    `reportedUserId` VARCHAR(191) NOT NULL,
    `reporterUserId` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `severity` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `resolvedAt` DATETIME(3) NULL,
    `resolvedById` VARCHAR(191) NULL,

    INDEX `report_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `report_reportedUserId_idx`(`reportedUserId`),
    INDEX `report_reporterUserId_idx`(`reporterUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `report`
    ADD CONSTRAINT `report_reportedUserId_fkey`
        FOREIGN KEY (`reportedUserId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `report_reporterUserId_fkey`
        FOREIGN KEY (`reporterUserId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `report_resolvedById_fkey`
        FOREIGN KEY (`resolvedById`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
