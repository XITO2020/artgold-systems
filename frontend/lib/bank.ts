import { Keypair, PublicKey } from '@solana/web3.js';
import { TabToken } from './blockchains/solana/tab-token';
import { AGTToken } from './blockchains/solana/agt-token';
import { prisma } from './db';

export class Bank {
  private readonly MIN_RESERVE = 1000;
  private readonly MEME_MINT_VALUE = 1000;

  constructor(
    private readonly bankKeyPair: Keypair,
    private readonly tabzReserve: number = 19000,
    private readonly agtReserve: number = 27000
  ) {}

  async transferTokens(
    artistAddress: string,
    amount: number,
    tokenType: 'TABZ' | 'AGT'
  ) {
    const authority = Keypair.fromSecretKey(
      Buffer.from(process.env.BANK_PRIVATE_KEY!, 'base64')
    );
    
    if (tokenType === 'TABZ') {
      const tabToken = new TabToken('mainnet-beta');
      await tabToken.transfer(authority, new PublicKey(artistAddress), amount);
    } else {
      const agtToken = new AGTToken('mainnet-beta');
      await agtToken.transfer(authority, new PublicKey(artistAddress), amount);
    }
  }

  async addMemeToReserve(
    memeHash: string,
    title: string,
    url: string,
    adminId: string
  ) {
    await prisma.$transaction(async (tx) => {
      // Add meme to reserve
      await tx.memeralReserve.create({
        data: {
          memeHash,
          title,
          url,
          addedBy: adminId,
          tabzValue: this.MEME_MINT_VALUE
        }
      });

      // Record transaction
      await tx.bankTransaction.create({
        data: {
          userId: adminId,
          type: 'MEME_MINT',
          tokenType: 'TABZ',
          amount: this.MEME_MINT_VALUE,
          fromAddress: 'BANK',
          toAddress: 'RESERVE',
          memeHash,
          metadata: { title }
        }
      });

      // Update bank reserves
      await tx.bankReserve.update({
        where: { tokenType: 'TABZ' },
        data: {
          currentAmount: { increment: this.MEME_MINT_VALUE }
        }
      });
    });

    return { success: true };
  }

  async purchaseArtwork(
    artworkId: string,
    sellerAddress: string,
    amount: number,
    tokenType: 'TABZ' | 'AGT'
  ) {
    const reserve = await prisma.bankReserve.findUnique({
      where: { tokenType }
    });

    if (!reserve || Number(reserve.currentAmount) < amount + this.MIN_RESERVE) {
      throw new Error('Insufficient bank reserve');
    }

    if (amount > 1000) {
      throw new Error('Amount exceeds maximum purchase');
    }

    await prisma.$transaction(async (tx) => {
      // Update bank reserves
      await tx.bankReserve.update({
        where: { tokenType },
        data: {
          currentAmount: { decrement: amount }
        }
      });

      // Record transaction
      await tx.bankTransaction.create({
        data: {
          userId: sellerAddress,
          type: 'PURCHASE',
          tokenType,
          amount,
          fromAddress: 'BANK',
          toAddress: sellerAddress,
          artworkId,
          metadata: {}
        }
      });

      // Transfer tokens
      await this.transferTokens(sellerAddress, amount, tokenType);
    });

    return { success: true };
  }

  async getReserves() {
    return await prisma.bankReserve.findMany();
  }

  async getTransactionHistory(filters?: {
    type?: string;
    tokenType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await prisma.bankTransaction.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.tokenType && { tokenType: filters.tokenType }),
        ...(filters?.startDate && filters?.endDate && {
          createdAt: {
            gte: filters.startDate,
            lte: filters.endDate
          }
        })
      },
      orderBy: { createdAt: 'desc' },
      include: {
        artwork: {
          include: {
            artist: {
              select: { name: true }
            }
          }
        }
      }
    });
  }
}