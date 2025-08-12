// api/admin/articles/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';
import slugify from 'slugify';

/**
 * api/admin/articles/create/route.ts

    Utilité : Ce fichier gère la création de nouveaux articles dans votre application. Il utilise les CID générés par Pinata pour stocker les URL des images et vidéos.
    Corrections : Assurez-vous que le module slugify est installé et importé correctement pour générer des slugs à partir des titres des articles.

 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      content,
      description,
      coverImage,
      chapters,
      tags
    } = await req.json();

    // Create slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Create article with relations
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        description,
        coverImage,
        authorId: session.user.id,
        published: false,
        chapters: {
          create: chapters.map((chapter: any, index: number) => ({
            title: chapter.title,
            content: chapter.content,
            videoUrl: chapter.videoUrl,
            thumbnail: chapter.thumbnail,
            duration: chapter.duration,
            order: index
          }))
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        chapters: true,
        tags: true
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
