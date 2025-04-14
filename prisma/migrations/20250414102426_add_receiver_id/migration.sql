-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- ⚠️ TEMP FIX: Update NULL values
-- Replace 'some-existing-user-id' with a valid user ID from your User table
UPDATE "Message" SET "receiverId" = 'ff73d6f6-a0c0-437d-9133-24cfcf52d0f9' WHERE "receiverId" IS NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "receiverId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
