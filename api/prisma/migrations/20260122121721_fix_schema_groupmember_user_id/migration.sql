/*
  Warnings:

  - You are about to drop the column `userid` on the `GroupMember` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,groupId]` on the table `GroupMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userid_fkey";

-- DropIndex
DROP INDEX "GroupMember_userid_groupId_key";

-- DropIndex
DROP INDEX "GroupMember_userid_lastReadAt_idx";

-- AlterTable
ALTER TABLE "GroupMember" DROP COLUMN "userid",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GroupMember_userId_lastReadAt_idx" ON "GroupMember"("userId", "lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_userId_groupId_key" ON "GroupMember"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
