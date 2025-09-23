-- CreateTable
CREATE TABLE `Taches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('EN_COURS', 'TERMINER', 'A_FAIRE') NOT NULL DEFAULT 'EN_COURS',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
