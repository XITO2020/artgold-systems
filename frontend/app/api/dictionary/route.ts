import { NextResponse } from 'next/server';
import { getDictionary } from '@lib/dictionary';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang');
  const page = searchParams.get('page');

  if (!lang || !page) {
    return new Response(JSON.stringify({ error: 'Language and page parameters are required' }), {
      status: 400,
    });
  }

  try {
    const dict = await getDictionary(lang, page);
    return NextResponse.json(dict);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch dictionary' }), {
      status: 500,
    });
  }
}
