-- CreateEnum
CREATE TYPE "MileageParameter" AS ENUM ('KM', 'MILES');

-- AlterTable
ALTER TABLE "Ads" ADD COLUMN     "commercialModel" TEXT,
ADD COLUMN     "commercialsMake" TEXT,
ADD COLUMN     "loadCapacity" DOUBLE PRECISION,
ADD COLUMN     "mileage" DOUBLE PRECISION,
ADD COLUMN     "mileageParameter" "MileageParameter",
ADD COLUMN     "motStatus" TEXT,
ADD COLUMN     "yearOfProduction" INTEGER;
