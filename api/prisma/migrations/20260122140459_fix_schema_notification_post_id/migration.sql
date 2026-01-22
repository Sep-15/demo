/*
  Warnings:

  - You are about to drop the column `postid` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postid_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postid",
ADD COLUMN     "postId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
