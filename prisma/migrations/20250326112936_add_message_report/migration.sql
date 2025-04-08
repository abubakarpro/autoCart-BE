-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reportReason" TEXT,
ADD COLUMN     "reported" BOOLEAN NOT NULL DEFAULT false;
