'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import { FaStar } from 'react-icons/fa6';
import { tmdbImage } from '@/utils/tmdbImage';

export interface MediaCardItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

interface MediaCardProps {
  item: MediaCardItem;
  mediaType: 'movie' | 'tv';
  watchLabel: string;
}

const MediaCard: React.FC<MediaCardProps> = React.memo(({ item, mediaType, watchLabel }) => {
  const displayTitle = mediaType === 'movie' ? item.title : item.name;
  const dateStr = mediaType === 'movie' ? item.release_date : item.first_air_date;
  const releaseYear = dateStr ? dateStr.slice(0, 4) : null;
  const href =
    mediaType === 'movie'
      ? `/browse/movies/title/${item.id}`
      : `/browse/tv-shows/title/${item.id}`;

  return (
    <div className="relative movie-card group max-w-8 mb-100">
      <WatchlistButton
        titleId={item.id.toString()}
        titleType={mediaType}
        style="badge"
        className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
      />
      <div className="aspect-w-2 aspect-h-3">
        <Image
          src={tmdbImage(item.poster_path, 'w342')}
          alt={displayTitle || 'Title'}
          width={200}
          height={300}
          loading="lazy"
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="movie-card-overlay text-center">
        <h3 className="movie-title dark:text-white text-white mx-2 line-clamp-2">
          {displayTitle}
        </h3>
        <Link href={href}>
          <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">{watchLabel}</Button>
        </Link>
        <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">
          <span className="text-white rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1 text-sm">
            {releaseYear || '—'}
          </span>
          <span className="text-white rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1 text-sm">
            <FaStar className="inline-block text-yellow-50" />
            {((item.vote_average ?? 0) / 2).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
});

MediaCard.displayName = 'MediaCard';

export default MediaCard;
