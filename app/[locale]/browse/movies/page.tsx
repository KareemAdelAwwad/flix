import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BrowseCatalogView from '@/components/BrowseCatalogView';
import { getBrowseMovies } from '@/lib/tmdb';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'MoviesShows' });
  return {
    title: t('movies'),
  };
}

export default async function MoviesBrowsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getBrowseMovies(locale).catch((err) => {
    console.error('Error fetching movies:', err);
    return { popular: [], topRated: [], trending: [], action: [] };
  });

  return (
    <BrowseCatalogView
      mediaType="movie"
      translationNamespace="MoviesShows"
      featuredTitleKey="featuredMovie"
      watchLabelKey="watchMovie"
      featured={data.popular[0]}
      sections={[
        { key: 'popular', items: data.popular },
        { key: 'top10', items: data.topRated },
        { key: 'trending', items: data.trending },
        { key: 'action', items: data.action },
      ]}
    />
  );
}
