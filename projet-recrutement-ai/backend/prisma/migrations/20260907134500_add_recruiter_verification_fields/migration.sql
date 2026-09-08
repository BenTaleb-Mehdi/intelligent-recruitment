-- Add recruiter verification/profile fields required by the current Prisma schema.
ALTER TABLE `recruiter`
    ADD COLUMN `iceNumber` VARCHAR(191) NULL,
    ADD COLUMN `rcNumber` VARCHAR(191) NULL,
    ADD COLUMN `verification_status` ENUM('UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'UNVERIFIED',
    ADD COLUMN `is_profile_complete` BOOLEAN NOT NULL DEFAULT false;
