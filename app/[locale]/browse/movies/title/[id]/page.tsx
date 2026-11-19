import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import MovieDetailView from '@/components/TitlePage/MovieDetailView';
import { extractYoutubeTrailerKey, getMovieDetailBundle } from '@/lib/tmdb';
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
    const movie = await getMovieDetailBundle(id, locale);
    return {
      title: movie.title,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.backdrop_path
          ? [{ url: tmdbImage(movie.backdrop_path, 'w1280'), width: 1280, height: 720 }]
          : [],
        url: `https://flix.kareemadel.com/${locale}/browse/movies/title/${id}`,
        locale,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Movie | Flix App' };
  }
}

export default async function MovieTitlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  let movie;
  try {
    movie = await getMovieDetailBundle(id, locale);
  } catch {
    notFound();
  }

  if (!movie?.id) {
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
    titleName: movie.title || '',
    titleType: 'movie',
    adult: movie.adult,
    keywords: movie.keywords?.keywords,
    releaseDates: movie.release_dates?.results,
    userEmail,
  });

  if (blocked) {
    redirect(`/${locale}/browse/movies`);
  }

  const trailerKey = extractYoutubeTrailerKey(movie.videos);
  const recommendations = await filterBlockedTitles(
    movie.recommendations?.results || [],
    'movie',
    userEmail
  );

  return (
    <MovieDetailView
      movie={movie}
      trailerKey={trailerKey}
      recommendations={recommendations}
    />
  );
}
