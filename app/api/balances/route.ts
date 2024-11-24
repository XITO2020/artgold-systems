import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { address } = await req.json();

    // Get TABZ balance from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    });

    // Get Solana balance
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
    const solanaBalance = await connection.getBalance(new PublicKey(address));

    // For demo purposes, Monero balance is mocked
    const moneroBalance = 0.0;

    return NextResponse.json({
      tabz: user?.balance || 0,
      solana: solanaBalance / 1e9, // Convert lamports to SOL
      monero: moneroBalance
    });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}