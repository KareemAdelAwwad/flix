'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import HorizontalCarousel, { CarouselSettings } from '@/components/carousel';
import { Button } from '@/components/ui/button';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import MediaCard, { MediaCardItem } from '@/components/MediaCard';
import { tmdbImage } from '@/utils/tmdbImage';

const CAROUSEL_SETTINGS: CarouselSettings = {
  breakpoints: {
    480: 1,
    700: 2,
    920: 3,
    1130: 4,
    1280: 5,
    1536: 6,
  },
  defaultImagesPerPage: 7,
};

export interface BrowseCatalogItem extends MediaCardItem {
  tagline?: string;
  overview?: string;
  backdrop_path?: string | null;
}

export interface BrowseSection {
  key: string;
  items: BrowseCatalogItem[];
}

interface BrowseCatalogViewProps {
  mediaType: 'movie' | 'tv';
  translationNamespace: 'MoviesShows' | 'TVShows';
  featuredTitleKey: string;
  watchLabelKey: string;
  featured: BrowseCatalogItem | undefined;
  sections: BrowseSection[];
}

const BrowseCatalogView: React.FC<BrowseCatalogViewProps> = ({
  mediaType,
  translationNamespace,
  featuredTitleKey,
  watchLabelKey,
  featured,
  sections,
}) => {
  const t = useTranslations(translationNamespace);
  const watchLabel = t(watchLabelKey);

  const renderCard = useCallback(
    ({ item }: { item: BrowseCatalogItem }) => (
      <MediaCard item={item} mediaType={mediaType} watchLabel={watchLabel} />
    ),
    [mediaType, watchLabel]
  );

  const featuredTitle = featured
    ? mediaType === 'movie'
      ? featured.title
      : featured.name
    : '';
  const featuredHref = featured
    ? `/browse/${mediaType === 'movie' ? 'movies' : 'tv-shows'}/title/${featured.id}`
    : '#';

  return (
    <main className="container">
      <section className="my-10">
        <h2 className="text-3xl font-bold mb-4">{t(featuredTitleKey)}</h2>
        {featured ? (
          <div className="relative w-full h-[500px] mb-8">
            <Image
              src={tmdbImage(featured.backdrop_path, 'w1280')}
              alt={featuredTitle || 'Featured'}
              fill
              priority
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50 rounded-lg bg-gradient-to-t from-black-6 to-transparent">
              <h3 className="text-3xl text-white font-bold">{featuredTitle}</h3>
              <p className="text-white mt-2 w-[80vw] md:w-[60vw] line-clamp-3">
                {featured.tagline || featured.overview}
              </p>
              <Link href={featuredHref}>
                <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">{watchLabel}</Button>
              </Link>
            </div>
            <div className="absolute bottom-4 w-full flex items-center justify-between px-4">
              <span className="text-white text-lg">
                {(mediaType === 'movie' ? featured.release_date : featured.first_air_date)?.slice(
                  0,
                  4
                ) || ''}
              </span>
              <WatchlistButton
                titleId={featured.id.toString()}
                titleType={mediaType}
                style="text"
              />
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-black-30 animate-pulse rounded-lg" />
        )}

        {sections.map((section) => (
          <section key={section.key} id={section.key} className="my-20 pt-0">
            <h2 className="text-3xl font-bold mb-12">{t(section.key)}</h2>
            <HorizontalCarousel
              data={section.items}
              navStyle="style3"
              ItemComponent={renderCard}
              settings={CAROUSEL_SETTINGS}
            />
          </section>
        ))}
      </section>
    </main>
  );
};

export default BrowseCatalogView;
