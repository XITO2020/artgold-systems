import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/portfolio?category=&series=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const category = (req.query.category as string) || '';
    const series = (req.query.series as string) || undefined;
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const limit = Math.max(parseInt((req.query.limit as string) || '12', 10), 1);

    if (!category) {
      return res.status(400).json({ error: 'missing_category' });
    }

    const where: any = {
      category,
      ...(series ? { series } : {})
    };

    const [items, total] = await Promise.all([
      prisma.portfolioItem.findMany({
        where,
        include: {
          comments: {
            include: {
              user: { select: { name: true, image: true } }
            }
          },
          user: { select: { name: true, image: true } }
        },
        orderBy: [
          { series: 'asc' },
          { order: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.portfolioItem.count({ where }),
    ]);

    return res.json({
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (e: any) {
    console.error('GET /api/portfolio error:', e);
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
