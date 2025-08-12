import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MoneroService } from '~/monero';
import { prisma } from '~/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();
    const monero = new MoneroService();

    // Create payment request
    const paymentDetails = await monero.createPaymentRequest(amount);

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: 'PURCHASE',
        status: 'PENDING',
        paymentId: paymentDetails.paymentId,
      },
    });

    return NextResponse.json({
      transactionId: transaction.id,
      ...paymentDetails
    });
  } catch (error) {
    console.error('Monero payment error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const paymentId = url.searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    const monero = new MoneroService();
    const paymentStatus = await monero.checkPayment(paymentId);

    if (paymentStatus.confirmed) {
      // Update transaction status
      await prisma.transaction.updateMany({
        where: {
          paymentId,
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED'
        }
      });
    }

    return NextResponse.json(paymentStatus);
  } catch (error) {
    console.error('Monero payment check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}