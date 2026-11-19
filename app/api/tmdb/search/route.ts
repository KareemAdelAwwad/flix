import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim() || '';
  const locale = req.nextUrl.searchParams.get('locale') || 'en';

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await tmdbFetch<{ results?: unknown[] }>(
      `/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=${encodeURIComponent(locale)}&page=1`,
      300
    );

    return NextResponse.json({
      results: (data.results || []).slice(0, 5),
    });
  } catch (error) {
    console.error('TMDB search error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
