/*
  Warnings:

  - You are about to drop the column `lastReadAt` on the `GroupMember` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "GroupRole" ADD VALUE 'OWNER';

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMessage" DROP CONSTRAINT "GroupMessage_groupId_fkey";

-- DropIndex
DROP INDEX "GroupMember_userId_lastReadAt_idx";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "lastReadAt",
ADD COLUMN     "lastReadMessageId" INTEGER;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "groupId" INTEGER;

-- CreateIndex
CREATE INDEX "GroupMember_groupId_idx" ON "GroupMember"("groupId");

-- CreateIndex
CREATE INDEX "GroupMember_userId_idx" ON "GroupMember"("userId");

-- CreateIndex
CREATE INDEX "GroupMember_groupId_lastReadMessageId_idx" ON "GroupMember"("groupId", "lastReadMessageId");

-- CreateIndex
CREATE INDEX "GroupMessage_groupId_id_idx" ON "GroupMessage"("groupId", "id");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
