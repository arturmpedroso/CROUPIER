/*
  Warnings:

  - A unique constraint covering the columns `[shareCode]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shareCode` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `group` ADD COLUMN `shareCode` VARCHAR(191) NOT NULL,
    MODIFY `description` TEXT NULL;

-- CreateTable
CREATE TABLE `Flashcard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `totalCorrect` INTEGER NOT NULL DEFAULT 0,
    `totalWrong` INTEGER NOT NULL DEFAULT 0,
    `deckId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserScore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flashcardId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `correct` INTEGER NOT NULL DEFAULT 0,
    `wrong` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserScore_flashcardId_userId_key`(`flashcardId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `stars` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Group_shareCode_key` ON `Group`(`shareCode`);

-- AddForeignKey
ALTER TABLE `Flashcard` ADD CONSTRAINT `Flashcard_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `Deck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserScore` ADD CONSTRAINT `UserScore_flashcardId_fkey` FOREIGN KEY (`flashcardId`) REFERENCES `Flashcard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserScore` ADD CONSTRAINT `UserScore_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
