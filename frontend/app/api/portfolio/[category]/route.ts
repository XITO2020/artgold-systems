import { NextResponse } from 'next/server';
import { apiClient } from '@lib/db/prisma';
import type { PortfolioCategory } from '@t/portfolio';

export async function GET(
  req: Request,
  { params }: { params: { category: PortfolioCategory } }
) {
  const { searchParams } = new URL(req.url);
  const series = searchParams.get('series');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const qs = new URLSearchParams({
      category: params.category,
      ...(series ? { series } : {}),
      page: String(page),
      limit: String(limit),
    }).toString();

    const data = await apiClient.get(`/portfolio?${qs}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}