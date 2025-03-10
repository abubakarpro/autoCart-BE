-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'TRADER_SELLER', 'PRIVATE_SELLER');

-- CreateEnum
CREATE TYPE "PriceCurrency" AS ENUM ('EURO', 'POUND');

-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('SELLER', 'WANTED');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('NEW', 'USED', 'ACTIVE', 'EXPIRED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'OLD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "businessName" TEXT,
    "address" TEXT NOT NULL,
    "vatNumber" TEXT,
    "dealerLicense" TEXT NOT NULL,
    "profileImage" TEXT,
    "backgroundImage" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifyUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "usernameType" TEXT NOT NULL,
    "type" "Role" NOT NULL,
    "verificationTries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_Active" BOOLEAN NOT NULL DEFAULT true,
    "is_Deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verifyUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ads" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uploadImagesForAd" TEXT[],
    "uploadImagesForStory" TEXT[],
    "vehicleLicenseNumber" TEXT,
    "itemName" TEXT NOT NULL,
    "status" "AdStatus" NOT NULL,
    "adType" "AdType" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "condition" "ItemCondition" NOT NULL,
    "priceCurrency" "PriceCurrency" NOT NULL,
    "descriptions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verifyUser_username_key" ON "verifyUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_followerId_followingId_key" ON "Follower"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ads" ADD CONSTRAINT "Ads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
