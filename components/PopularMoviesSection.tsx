'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import HorizontalCarousel, { CarouselSettings } from '@/components/carousel';
import MediaCard from '@/components/MediaCard';
import { Movie } from '@/types/title';

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

interface PopularMoviesSectionProps {
  movies: Movie[];
}

const PopularMoviesSection: React.FC<PopularMoviesSectionProps> = ({ movies }) => {
  const t = useTranslations('MoviesShows');

  const MovieCarouselItem = React.useCallback(
    ({ item }: { item: Movie }) => (
      <MediaCard item={item} mediaType="movie" watchLabel={t('watchMovie')} />
    ),
    [t]
  );

  return (
    <section className="my-10">
      <div className="my-12">
        <h2 className="text-3xl font-bold dark:text-white mb-8">{t('popular')}</h2>
        <HorizontalCarousel
          data={movies}
          navStyle="style3"
          ItemComponent={MovieCarouselItem}
          settings={CAROUSEL_SETTINGS}
        />
      </div>
    </section>
  );
};

export default PopularMoviesSection;
