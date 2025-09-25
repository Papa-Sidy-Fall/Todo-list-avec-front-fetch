/*
  Warnings:

  - Added the required column `updatedAt` to the `Taches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Taches` ADD COLUMN `completedAt` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `startedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('EN_COURS', 'TERMINER', 'A_FAIRE') NOT NULL DEFAULT 'A_FAIRE';

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('TASK_COMPLETED', 'TASK_MODIFIED', 'TASK_DELETED', 'TASK_ASSIGNED') NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `taskId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_read_idx`(`read`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Taches_status_idx` ON `Taches`(`status`);

-- CreateIndex
CREATE INDEX `Taches_createdAt_idx` ON `Taches`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Taches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Taches` RENAME INDEX `Taches_assignedTo_fkey` TO `Taches_assignedTo_idx`;

-- RenameIndex
ALTER TABLE `Taches` RENAME INDEX `Taches_userId_fkey` TO `Taches_userId_idx`;
