/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shareCode` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Deck_groupId_fkey` ON `deck`;

-- DropIndex
DROP INDEX `Group_ownerId_fkey` ON `group`;

-- DropIndex
DROP INDEX `GroupShare_userId_fkey` ON `groupshare`;

-- AlterTable
ALTER TABLE `group` ADD COLUMN `shareCode` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Group_shareCode_key` ON `Group`(`shareCode`);

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupShare` ADD CONSTRAINT `GroupShare_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GroupShare` ADD CONSTRAINT `GroupShare_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
