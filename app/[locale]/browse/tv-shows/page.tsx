import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BrowseCatalogView from '@/components/BrowseCatalogView';
import { getBrowseShows } from '@/lib/tmdb';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TVShows' });
  return {
    title: t('shows'),
  };
}

export default async function ShowsBrowsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getBrowseShows(locale).catch((err) => {
    console.error('Error fetching TV shows:', err);
    return { popular: [], topRated: [], trending: [], airingToday: [] };
  });

  return (
    <BrowseCatalogView
      mediaType="tv"
      translationNamespace="TVShows"
      featuredTitleKey="featuredShow"
      watchLabelKey="watchShow"
      featured={data.popular[0]}
      sections={[
        { key: 'popular', items: data.popular },
        { key: 'top10', items: data.topRated },
        { key: 'trending', items: data.trending },
        { key: 'airing_today', items: data.airingToday },
      ]}
    />
  );
}
