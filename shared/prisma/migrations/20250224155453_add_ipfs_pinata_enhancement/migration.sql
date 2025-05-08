/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Artwork` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `TShirt` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `TShirt` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `TShirt` table. All the data in the column will be lost.
  - You are about to drop the column `sales` on the `TShirt` table. All the data in the column will be lost.
  - You are about to drop the column `sizes` on the `TShirt` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `TShirt` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `imageId` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `TShirt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IPFSStatus" AS ENUM ('PENDING', 'UPLOADED', 'FAILED');

-- DropIndex
DROP INDEX "Article_slug_key";

-- DropIndex
DROP INDEX "TShirt_sales_idx";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "coverImage",
DROP COLUMN "description",
DROP COLUMN "slug",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "Artwork" DROP COLUMN "imageUrl",
ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "thumbnail",
DROP COLUMN "videoUrl",
ADD COLUMN     "thumbnailId" TEXT,
ADD COLUMN     "videoId" TEXT;

-- AlterTable
ALTER TABLE "TShirt" DROP COLUMN "colors",
DROP COLUMN "imageUrl",
DROP COLUMN "projectId",
DROP COLUMN "sales",
DROP COLUMN "sizes",
ADD COLUMN     "imageId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "IPFSMedia" (
    "id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" "IPFSStatus" NOT NULL DEFAULT 'PENDING',
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPFSMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "thumbnail" TEXT,
    "series" TEXT,
    "order" INTEGER,
    "duration" INTEGER,
    "modelFormat" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "PortfolioComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioLike" (
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioLike_pkey" PRIMARY KEY ("userId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "IPFSMedia_cid_key" ON "IPFSMedia"("cid");

-- CreateIndex
CREATE INDEX "IPFSMedia_cid_idx" ON "IPFSMedia"("cid");

-- CreateIndex
CREATE INDEX "IPFSMedia_status_idx" ON "IPFSMedia"("status");

-- CreateIndex
CREATE INDEX "PortfolioItem_category_idx" ON "PortfolioItem"("category");

-- CreateIndex
CREATE INDEX "PortfolioItem_series_idx" ON "PortfolioItem"("series");

-- CreateIndex
CREATE INDEX "PortfolioItem_userId_idx" ON "PortfolioItem"("userId");

-- CreateIndex
CREATE INDEX "PortfolioComment_userId_idx" ON "PortfolioComment"("userId");

-- CreateIndex
CREATE INDEX "PortfolioComment_itemId_idx" ON "PortfolioComment"("itemId");

-- CreateIndex
CREATE INDEX "PortfolioLike_userId_idx" ON "PortfolioLike"("userId");

-- CreateIndex
CREATE INDEX "PortfolioLike_itemId_idx" ON "PortfolioLike"("itemId");

-- CreateIndex
CREATE INDEX "TShirt_inStock_idx" ON "TShirt"("inStock");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "IPFSMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "IPFSMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "IPFSMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "IPFSMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TShirt" ADD CONSTRAINT "TShirt_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "IPFSMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "IPFSMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioComment" ADD CONSTRAINT "PortfolioComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioComment" ADD CONSTRAINT "PortfolioComment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "PortfolioItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioLike" ADD CONSTRAINT "PortfolioLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioLike" ADD CONSTRAINT "PortfolioLike_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "PortfolioItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
