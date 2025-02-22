/*
  Warnings:

  - You are about to alter the column `currentValue` on the `Artwork` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `amount` on the `ArtworkPurchase` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `sharePercent` on the `ArtworkPurchase` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,4)`.
  - You are about to alter the column `aiScore` on the `ArtworkValidation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,4)`.
  - You are about to alter the column `price` on the `BonusSlot` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `price` on the `BonusSlotTransfer` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `confidence` on the `ContentValidation` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,4)`.
  - You are about to alter the column `amount` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `receivedAmount` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `confidence` on the `FraudAttempt` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(5,4)`.
  - You are about to alter the column `amount` on the `Purchase` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `amount` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `previousValue` on the `ValueDistribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `newValue` on the `ValueDistribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `creatorShare` on the `ValueDistribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `ownerShare` on the `ValueDistribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.
  - You are about to alter the column `buyersShare` on the `ValueDistribution` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(20,8)`.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'FROZEN', 'BANNED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SALE', 'PURCHASE', 'OFFER', 'PRICE_CHANGE', 'LIKE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ArtCategory" AS ENUM ('african', 'pacifikian', 'oriental', 'indian', 'amerindian', 'slavic', 'calligraphy', 'inked', 'sketches', 'manga', 'comics', 'abstract', 'realisticXIX', 'realisticXX', 'realisticXXI', 'paper', 'textil', 'onwood', 'oil', 'acrylic', 'pencil', 'watercolor', 'sculpture', 'photography', 'portrait', 'landscape', 'objects', 'creatures', 'architecture', 'technology', 'map', 'characterdesign', 'meca', 'fantaisy', 'medieval', 'schoolsketch', 'poster', 'emblem_coat_of_arms', 'Memes', 'Animated_Gif', 'Motion_Design', 'Illustrator_Ai', 'Pixel_Art', 'Photoshop_PSD', 'invention', 'ecologicalplan', 'vehicles_concept', 'visual_effect', 'labyrinth_game', 'other');

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "featuredUntil" TIMESTAMP(3),
ADD COLUMN     "price" DECIMAL(20,8),
ADD COLUMN     "royaltyRate" DECIMAL(5,4) NOT NULL DEFAULT 0.1,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
ALTER COLUMN "currentValue" DROP DEFAULT,
ALTER COLUMN "currentValue" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "ArtworkPurchase" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "sharePercent" SET DATA TYPE DECIMAL(5,4);

-- AlterTable
ALTER TABLE "ArtworkValidation" ALTER COLUMN "aiScore" SET DATA TYPE DECIMAL(5,4);

-- AlterTable
ALTER TABLE "BonusSlot" ALTER COLUMN "price" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "BonusSlotTransfer" ALTER COLUMN "price" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "ContentValidation" ALTER COLUMN "confidence" SET DATA TYPE DECIMAL(5,4);

-- AlterTable
ALTER TABLE "Exchange" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "receivedAmount" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "FraudAttempt" ALTER COLUMN "confidence" SET DATA TYPE DECIMAL(5,4);

-- AlterTable
ALTER TABLE "Purchase" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(20,8);

-- AlterTable
ALTER TABLE "ValueDistribution" ALTER COLUMN "previousValue" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "newValue" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "creatorShare" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "ownerShare" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "buyersShare" SET DATA TYPE DECIMAL(20,8);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "thumbnail" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkOffer" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "status" "OfferStatus" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtworkOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalSales" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "totalPurchases" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "lastActive" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketMetrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalVolume" DECIMAL(20,8) NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "newUsers" INTEGER NOT NULL,
    "transactions" INTEGER NOT NULL,
    "avgPrice" DECIMAL(20,8) NOT NULL,

    CONSTRAINT "MarketMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TShirt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "sizes" TEXT[],
    "colors" TEXT[],
    "category" TEXT NOT NULL,
    "projectId" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TShirt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TShirtPurchase" (
    "id" TEXT NOT NULL,
    "tshirtId" TEXT NOT NULL,
    "userId" TEXT,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TShirtPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

-- CreateIndex
CREATE INDEX "Article_published_idx" ON "Article"("published");

-- CreateIndex
CREATE INDEX "Chapter_articleId_idx" ON "Chapter"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "ArtworkOffer_artworkId_idx" ON "ArtworkOffer"("artworkId");

-- CreateIndex
CREATE INDEX "ArtworkOffer_buyerId_idx" ON "ArtworkOffer"("buyerId");

-- CreateIndex
CREATE INDEX "ArtworkOffer_status_idx" ON "ArtworkOffer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetrics_userId_key" ON "UserMetrics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketMetrics_date_key" ON "MarketMetrics"("date");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "TShirt_category_idx" ON "TShirt"("category");

-- CreateIndex
CREATE INDEX "TShirt_sales_idx" ON "TShirt"("sales");

-- CreateIndex
CREATE INDEX "TShirtPurchase_tshirtId_idx" ON "TShirtPurchase"("tshirtId");

-- CreateIndex
CREATE INDEX "TShirtPurchase_userId_idx" ON "TShirtPurchase"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag"("B");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkOffer" ADD CONSTRAINT "ArtworkOffer_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkOffer" ADD CONSTRAINT "ArtworkOffer_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetrics" ADD CONSTRAINT "UserMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TShirtPurchase" ADD CONSTRAINT "TShirtPurchase_tshirtId_fkey" FOREIGN KEY ("tshirtId") REFERENCES "TShirt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TShirtPurchase" ADD CONSTRAINT "TShirtPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
