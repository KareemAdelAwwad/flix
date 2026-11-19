import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import SeriesDetailView from '@/components/TitlePage/SeriesDetailView';
import { extractYoutubeTrailerKey, getSeriesDetailBundle } from '@/lib/tmdb';
import { filterBlockedTitles, isBlockedFromDetails } from '@/utils/filter';
import { tmdbImage } from '@/utils/tmdbImage';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const series = await getSeriesDetailBundle(id, locale);
    return {
      title: series.name,
      description: series.overview,
      openGraph: {
        title: series.name,
        description: series.overview,
        images: series.backdrop_path
          ? [{ url: tmdbImage(series.backdrop_path, 'w1280'), width: 1280, height: 720 }]
          : [],
        url: `https://flix.kareemadel.com/${locale}/browse/tv-shows/title/${id}`,
        locale,
        type: 'website',
      },
    };
  } catch {
    return { title: 'TV Show | Flix App' };
  }
}

export default async function SeriesTitlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  let series;
  try {
    series = await getSeriesDetailBundle(id, locale);
  } catch {
    notFound();
  }

  if (!series?.id) {
    notFound();
  }

  let userEmail: string | null | undefined = null;
  try {
    const user = await currentUser();
    userEmail = user?.primaryEmailAddress?.emailAddress;
  } catch {
    userEmail = null;
  }

  const blocked = isBlockedFromDetails({
    titleName: series.name || '',
    titleType: 'series',
    adult: series.adult,
    keywords: series.keywords?.results,
    contentRatings: series.content_ratings?.results,
    userEmail,
  });

  if (blocked) {
    redirect(`/${locale}/browse/tv-shows`);
  }

  const trailerKey = extractYoutubeTrailerKey(series.videos);
  const recommendations = await filterBlockedTitles(
    series.recommendations?.results || [],
    'series',
    userEmail
  );

  return (
    <SeriesDetailView
      series={series}
      trailerKey={trailerKey}
      imdbId={series.external_ids?.imdb_id || ''}
      recommendations={recommendations}
    />
  );
}
