-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "UserStatus" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
