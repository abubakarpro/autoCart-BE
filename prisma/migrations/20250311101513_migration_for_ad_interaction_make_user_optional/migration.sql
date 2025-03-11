-- DropForeignKey
ALTER TABLE "AdInteraction" DROP CONSTRAINT "AdInteraction_userId_fkey";

-- AlterTable
ALTER TABLE "AdInteraction" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AdInteraction" ADD CONSTRAINT "AdInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
