-- AlterTable
ALTER TABLE "Ads" ADD COLUMN     "createDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dealerLicense" DROP NOT NULL;
