import { NextResponse } from 'next/server';
import { prisma } from '@lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'newest';

  try {
    const tshirts = await prisma.tShirt.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          },
          category ? { category } : {},
          { inStock: true }
        ]
      },
      orderBy: sort === 'newest' 
        ? { createdAt: 'desc' }
        : sort === 'popular'
        ? { sales: 'desc' }
        : { price: 'asc' },
      take: 50
    });

    return NextResponse.json(tshirts);
  } catch (error) {
    console.error('Error searching t-shirts:', error);
    return NextResponse.json(
      { error: 'Failed to search t-shirts' },
      { status: 500 }
    );
  }
}