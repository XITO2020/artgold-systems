-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('TABZ', 'AGT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'SALE', 'EXCHANGE', 'CONVERSION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ExchangeStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "artworkCount" INTEGER NOT NULL DEFAULT 0,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "discordVerified" BOOLEAN NOT NULL DEFAULT false,
    "discordRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bonusSlots" INTEGER NOT NULL DEFAULT 0,
    "maxArtworks" INTEGER NOT NULL DEFAULT 12,
    "bonusSlotTokens" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serialNumber" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "dimensions" JSONB NOT NULL,
    "weight" JSONB,
    "materials" TEXT[],
    "technique" TEXT,
    "story" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artistId" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "points" INTEGER NOT NULL DEFAULT 0,
    "isFirst" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkValidation" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "aiScore" DOUBLE PRECISION NOT NULL,
    "patterns" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtworkValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkPurchase" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "sharePercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtworkPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueDistribution" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "previousValue" DOUBLE PRECISION NOT NULL,
    "newValue" DOUBLE PRECISION NOT NULL,
    "creatorShare" DOUBLE PRECISION NOT NULL,
    "ownerShare" DOUBLE PRECISION NOT NULL,
    "buyersShare" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValueDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "symbol" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,
    "provider" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromToken" "TokenType" NOT NULL,
    "toToken" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "receivedAmount" DOUBLE PRECISION NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "status" "ExchangeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistCategorySubmission" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isFirst" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "ArtistCategorySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentValidation" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "archiveReason" TEXT,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCleanup" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentCleanup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleanupLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CleanupLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BonusSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "artworkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "canTransfer" BOOLEAN NOT NULL DEFAULT true,
    "price" DOUBLE PRECISION,

    CONSTRAINT "BonusSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BonusSlotTransfer" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BonusSlotTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookError" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "eventType" TEXT,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookRetry" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "nextAttempt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookRetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_serialNumber_key" ON "Artwork"("serialNumber");

-- CreateIndex
CREATE INDEX "Content_status_idx" ON "Content"("status");

-- CreateIndex
CREATE INDEX "Content_category_idx" ON "Content"("category");

-- CreateIndex
CREATE INDEX "Content_createdAt_idx" ON "Content"("createdAt");

-- CreateIndex
CREATE INDEX "ContentCleanup_contentId_idx" ON "ContentCleanup"("contentId");

-- CreateIndex
CREATE INDEX "CleanupLog_type_idx" ON "CleanupLog"("type");

-- CreateIndex
CREATE INDEX "CleanupLog_timestamp_idx" ON "CleanupLog"("timestamp");

-- CreateIndex
CREATE INDEX "Purchase_contentId_idx" ON "Purchase"("contentId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkValidation" ADD CONSTRAINT "ArtworkValidation_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkPurchase" ADD CONSTRAINT "ArtworkPurchase_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkPurchase" ADD CONSTRAINT "ArtworkPurchase_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueDistribution" ADD CONSTRAINT "ValueDistribution_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistCategorySubmission" ADD CONSTRAINT "ArtistCategorySubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistCategorySubmission" ADD CONSTRAINT "ArtistCategorySubmission_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudAttempt" ADD CONSTRAINT "FraudAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentValidation" ADD CONSTRAINT "ContentValidation_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCleanup" ADD CONSTRAINT "ContentCleanup_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSlot" ADD CONSTRAINT "BonusSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSlot" ADD CONSTRAINT "BonusSlot_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSlotTransfer" ADD CONSTRAINT "BonusSlotTransfer_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSlotTransfer" ADD CONSTRAINT "BonusSlotTransfer_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
