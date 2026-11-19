import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SupportView, { type SupportTrendingMovie } from '@/components/SupportView';
import { tmdbFetch } from '@/lib/tmdb';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Support' });
  return {
    title: t('title'),
    description: t('contactP'),
  };
}

export default async function SupportPage() {
  let movies: SupportTrendingMovie[] = [];
  try {
    const data = await tmdbFetch<{ results: SupportTrendingMovie[] }>(
      '/trending/movie/week?language=en-US&page=1',
      3600
    );
    movies = (data.results || []).slice(0, 16);
  } catch {
    movies = [];
  }

  return <SupportView movies={movies} />;
}
