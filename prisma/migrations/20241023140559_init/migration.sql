/*
  Warnings:

  - You are about to drop the `_UserCalendar` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserCalendar" DROP CONSTRAINT "_UserCalendar_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCalendar" DROP CONSTRAINT "_UserCalendar_B_fkey";

-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_UserCalendar";

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
