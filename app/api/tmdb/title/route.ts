import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  const id = req.nextUrl.searchParams.get('id');
  const locale = req.nextUrl.searchParams.get('locale') || 'en';

  if (!id || (type !== 'movie' && type !== 'tv')) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const data = await tmdbFetch(
      `/${type}/${encodeURIComponent(id)}?language=${encodeURIComponent(locale)}`,
      3600
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB title fetch error:', error);
    return NextResponse.json({ error: 'Failed to load title' }, { status: 500 });
  }
}
