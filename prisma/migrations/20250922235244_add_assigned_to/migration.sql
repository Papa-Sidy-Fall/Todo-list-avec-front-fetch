-- AlterTable
ALTER TABLE `Taches` ADD COLUMN `assignedTo` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Taches` ADD CONSTRAINT `Taches_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
