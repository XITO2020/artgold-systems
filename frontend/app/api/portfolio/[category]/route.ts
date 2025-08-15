import { NextResponse } from 'next/server';
import { prisma } from '@LI B/db';
import type { PortfolioCategory } from 'T/portfolio';

export async function GET(
  req: Request,
  { params }: { params: { category: PortfolioCategory } }
) {
  const { searchParams } = new URL(req.url);
  const series = searchParams.get('series');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const items = await prisma.portfolioItem.findMany({
      where: {
        category: params.category,
        ...(series && { series })
      },
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: [
        { series: 'asc' },
        { order: 'asc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.portfolioItem.count({
      where: {
        category: params.category,
        ...(series && { series })
      }
    });

    return NextResponse.json({
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}