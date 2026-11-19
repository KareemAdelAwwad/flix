import { NextRequest, NextResponse } from 'next/server';
import { tmdbFetch } from '@/lib/tmdb';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  const { id, seasonNumber } = await context.params;
  const locale = req.nextUrl.searchParams.get('locale') || 'en';

  try {
    const data = await tmdbFetch(
      `/tv/${encodeURIComponent(id)}/season/${encodeURIComponent(seasonNumber)}?language=${encodeURIComponent(locale)}`,
      3600
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB season fetch error:', error);
    return NextResponse.json({ error: 'Failed to load season' }, { status: 500 });
  }
}
