/*
  Warnings:

  - You are about to drop the column `url` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "url",
ADD COLUMN     "media" JSONB;
