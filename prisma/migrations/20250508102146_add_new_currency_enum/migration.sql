-- AlterEnum
ALTER TYPE "PriceCurrency" ADD VALUE 'PKR';

-- AlterTable
ALTER TABLE "Ads" ADD COLUMN     "countryOfRegistration" TEXT;
