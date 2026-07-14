-- CreateTable
CREATE TABLE `dropdown_list` (
    `id` VARCHAR(191) NOT NULL,
    `recruiterId` VARCHAR(191) NOT NULL,
    `type` ENUM('CONTRACT_TYPE', 'LOCATION', 'EXPERIENCE_LEVEL') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `dropdown_list_recruiterId_type_value_key`(`recruiterId`, `type`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dropdown_list` ADD CONSTRAINT `dropdown_list_recruiterId_fkey` FOREIGN KEY (`recruiterId`) REFERENCES `recruiter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
