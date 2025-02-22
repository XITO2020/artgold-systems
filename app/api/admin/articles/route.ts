import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch articles
    const articles = await fetchArticles();
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articleData = await req.json();
    
    // Create new article
    const article = await createArticle(articleData);
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

async function fetchArticles() {
  // Implement article fetching logic
  return [];
}

async function createArticle(data: any) {
  // Implement article creation logic
  return data;
}