-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "iPFSMediaId" TEXT;

-- CreateTable
CREATE TABLE "Nft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "tokenId" TEXT,
    "metadataUri" TEXT,
    "price" DECIMAL(20,8),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artworkId" TEXT,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Nft_ownerId_idx" ON "Nft"("ownerId");

-- CreateIndex
CREATE INDEX "Nft_creatorId_idx" ON "Nft"("creatorId");

-- CreateIndex
CREATE INDEX "Nft_chain_network_idx" ON "Nft"("chain", "network");

-- CreateIndex
CREATE INDEX "Nft_artworkId_idx" ON "Nft"("artworkId");

-- CreateIndex
CREATE UNIQUE INDEX "Nft_artworkId_key" ON "Nft"("artworkId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_iPFSMediaId_fkey" FOREIGN KEY ("iPFSMediaId") REFERENCES "IPFSMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "IPFSMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;
