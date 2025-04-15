-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('GENERAL', 'FRAUD', 'MISLEADING', 'VIOLATION', 'SPAM', 'INAPPROPRIATE', 'OTHER');

-- AlterTable
ALTER TABLE "AdReport" ADD COLUMN     "ReportCategory" "ReportCategory" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "UserReport" ADD COLUMN     "ReportCategory" "ReportCategory" NOT NULL DEFAULT 'GENERAL';

-- CreateTable
CREATE TABLE "StoryReport" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "count" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "ReportCategory" "ReportCategory" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryReport_storyId_reportedById_key" ON "StoryReport"("storyId", "reportedById");

-- AddForeignKey
ALTER TABLE "StoryReport" ADD CONSTRAINT "StoryReport_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryReport" ADD CONSTRAINT "StoryReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
