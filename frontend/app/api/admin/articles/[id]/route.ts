import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';

/*
api/admin/articles/[id]/route.ts

    Utilité : Ce fichier gère les opérations CRUD 
    (Create, Read, Update, Delete) pour les articles. 
    Il utilise les CID stockés dans la base de données 
    pour récupérer les fichiers depuis IPFS.
    Corrections : Assurez-vous que les routes 
    GET, PUT, et DELETE fonctionnent correctement et que
    les données sont mises à jour dans la base de données.

*/


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        chapters: {
          orderBy: { order: 'asc' }
        },
        tags: true,
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      published,
      chapters,
      tags
    } = await req.json();

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        content,
        coverImage,
        published,
        chapters: {
          deleteMany: {},
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
          set: [],
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
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}