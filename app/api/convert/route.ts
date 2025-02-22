import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ethers } from 'ethers';
import { prisma } from '~/db';
import { CONVERSION_RATES, TOKEN_CONFIG } from '~/token-config';

// Type definitions
type TokenType = 'TABZ' | 'AGT';
interface ConversionRequest {
  amount: number;
  tokenType: TokenType;
  ethAddress: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const body = await req.json();
    const { amount, tokenType, ethAddress } = validateConversionRequest(body);

    // Check minimum conversion amount
    const config = TOKEN_CONFIG[tokenType];
    const minAmount = tokenType === 'TABZ' ? 
      TOKEN_CONFIG.TABZ.minPurchase : 
      TOKEN_CONFIG.AGT.minPurchase;

    if (amount < minAmount || amount < config.minPurchase) {
      return NextResponse.json({
        error: `Minimum conversion amount is ${config.minPurchase} ${tokenType}`
      }, { status: 400 });
    }

    // Verify user has enough tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        balance: true,
        tokens: {
          where: { type: tokenType }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = user.tokens[0];
    if (!token || token.amount < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Check if tokens are still locked
    const now = new Date();
    const lockupPeriod = config.lockupPeriod;
    const tokenCreationDate = token.createdAt;
    const lockupEndDate = token.lockedUntil || new Date(tokenCreationDate.getTime() + lockupPeriod);

    if (now < lockupEndDate) {
      return NextResponse.json({
        error: `${tokenType} tokens are locked until ${lockupEndDate.toLocaleDateString()}`
      }, { status: 403 });
    }

    // Validate ETH address
    if (!ethers.isAddress(ethAddress)) {
      return NextResponse.json({ error: 'Invalid ETH address' }, { status: 400 });
    }

    // Calculate ETH amount with conversion rate
    const conversionRate = tokenType === 'TABZ' ? 
      CONVERSION_RATES.TABZ_TO_ETH : 
      CONVERSION_RATES.AGT_TO_ETH;
    
    const ethAmount = amount * conversionRate;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update token balance
      await tx.token.update({
        where: { id: token.id },
        data: { amount: { decrement: amount } },
      });
    
      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          user: { connect: { id: session.user.id } },
          amount,
          type: 'CONVERSION',
          status: 'COMPLETED',
          metadata: {
            tokenType,
            ethAddress,
            conversionRate,
            ethAmount,
          },
        },
      });
    
      return { transaction, ethAmount };
    });
    

    // In production: Implement ETH transfer here
    // const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    // const wallet = new ethers.Wallet(process.env.TREASURY_PRIVATE_KEY, provider);
    // const tx = await wallet.sendTransaction({
    //   to: ethAddress,
    //   value: ethers.parseEther(ethAmount.toString())
    // });
    // await tx.wait();

    return NextResponse.json({
      success: true,
      ethAmount,
      transactionId: result.transaction.id
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Conversion failed' },
      { status: 500 }
    );
  }
}

function validateConversionRequest(body: any): ConversionRequest {
  if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
    throw new Error('Invalid amount');
  }

  if (!body.tokenType || !['TABZ', 'AGT'].includes(body.tokenType)) {
    throw new Error('Invalid token type');
  }

  if (!body.ethAddress || typeof body.ethAddress !== 'string') {
    throw new Error('Invalid ETH address');
  }

  return body as ConversionRequest;
}
