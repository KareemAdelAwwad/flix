'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import HorizontalCarousel, { CarouselSettings } from '@/components/carousel';
import { Link } from '@/i18n/routing';
import WatchlistButton from '../ui/AddToWatchlistButton';
import { Title } from '@/types/title';
import { tmdbImage } from '@/utils/tmdbImage';

interface RecommendationsProps {
  header: string;
  titleType: 'movie' | 'tv';
  items: Title[];
}

const CAROUSEL_SETTINGS: CarouselSettings = {
  breakpoints: {
    550: 1,
    820: 2,
    1100: 3,
    1200: 4,
    1500: 5,
  },
  defaultImagesPerPage: 6,
};

const Recommendations: React.FC<RecommendationsProps> = ({ titleType, items, header }) => {
  const renderItem = useCallback(
    ({ item }: { item: Title }) => (
      <div className="overflow-hidden rounded-lg p-4 dark:bg-black-12 bg-gray-95 flex flex-col group w-full">
        <div className="relative w-full h-[300px] overflow-hidden rounded-lg group-hover:scale-105 transition-all">
          <Link
            href={`/browse/${titleType === 'movie' ? 'movies' : 'tv-shows'}/title/${item.id}`}
          >
            <Image
              src={tmdbImage(item.poster_path, 'w342')}
              alt={item.name || item.title || 'No title available'}
              width={250}
              height={300}
              loading="lazy"
              className="w-full h-full object-cover pointer-events-none"
            />
          </Link>
          {item.id && (
            <WatchlistButton
              titleId={item.id.toString()}
              titleType={titleType}
              style="badge"
              className="opacity-0 group-hover:opacity-100 transition-all"
            />
          )}
        </div>
      </div>
    ),
    [titleType]
  );

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">{header}</h2>
      {items.length > 0 ? (
        <HorizontalCarousel
          navStyle="style3"
          data={items}
          settings={CAROUSEL_SETTINGS}
          ItemComponent={renderItem}
        />
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendations;