'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import MediaCard from '@/components/MediaCard';
import type { PersonDetailBundle } from '@/lib/tmdb';
import type { MovieCredits, TVCredits } from '@/types/person';
import { tmdbImage } from '@/utils/tmdbImage';

interface PersonDetailViewProps {
  person: PersonDetailBundle;
}

const INITIAL_CREDITS_COUNT = 18;
const CREDITS_STEP = 18;

function toTimestamp(value: string | number | Date | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

const PersonDetailView: React.FC<PersonDetailViewProps> = ({ person }) => {
  const locale = useLocale();
  const titleTranslation = useTranslations('MoviesShows');
  const t = useTranslations('Person');
  const listsT = useTranslations('Lists');

  const [visibleMoviesCount, setVisibleMoviesCount] = useState(INITIAL_CREDITS_COUNT);
  const [visibleShowsCount, setVisibleShowsCount] = useState(INITIAL_CREDITS_COUNT);

  const movieCredits = useMemo(() => {
    const raw = (person.movie_credits?.cast || []).filter((m) => Boolean(m.poster_path));
    raw.sort((a, b) => toTimestamp(b.release_date) - toTimestamp(a.release_date));
    const unique = new Map<number, MovieCredits>();
    for (const item of raw) {
      if (!unique.has(item.id)) unique.set(item.id, item);
    }
    return Array.from(unique.values());
  }, [person.movie_credits]);

  const tvCredits = useMemo(() => {
    const raw = (person.tv_credits?.cast || []).filter((s) => Boolean(s.poster_path));
    raw.sort((a, b) => toTimestamp(b.first_air_date) - toTimestamp(a.first_air_date));
    const unique = new Map<number, TVCredits>();
    for (const item of raw) {
      if (!unique.has(item.id)) unique.set(item.id, item);
    }
    return Array.from(unique.values());
  }, [person.tv_credits]);

  const visibleMovies = useMemo(
    () => movieCredits.slice(0, visibleMoviesCount),
    [movieCredits, visibleMoviesCount]
  );

  const visibleShows = useMemo(
    () => tvCredits.slice(0, visibleShowsCount),
    [tvCredits, visibleShowsCount]
  );

  const containerClasses =
    'relative flex flex-col items-center gap-6 w-full borders rounded-lg p-4 pt-12 my-20';

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 borders h-fit rounded-lg overflow-hidden">
          <Image
            src={tmdbImage(person.profile_path, 'w500')}
            alt={person.name || 'Person profile'}
            width={500}
            height={750}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="md:col-span-3 flex flex-col justify-between h-full">
          <h1 className="text-4xl md:text-6xl mb-4 header">{person.name}</h1>
          <div>
            {person.birthday && (
              <p className="mb-2">
                {t('born')}: {new Date(person.birthday).toLocaleDateString(locale)}
              </p>
            )}
            {person.deathday && (
              <p className="mb-2">
                {t('death')}: {new Date(person.deathday).toLocaleDateString(locale)}
              </p>
            )}
            {person.place_of_birth && (
              <p className="mb-4">
                {t('place_of_birth')}: {person.place_of_birth}
              </p>
            )}
          </div>
          {person.biography && (
            <>
              <h2 className="text-2xl font-semibold mb-2">{t('biography')}</h2>
              <p className="mb-8">{person.biography}</p>
            </>
          )}
          {person.images?.profiles && person.images.profiles.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('images')}</h2>
              <div className="flex flex-row justify-start flex-wrap gap-4 w-full">
                {person.images.profiles.slice(0, 6).map((image) => (
                  <div key={image.file_path} className="relative image-card group">
                    <div className="aspect-w-2 aspect-h-3">
                      <Image
                        src={tmdbImage(image.file_path, 'w185')}
                        alt={person.name || 'Person image'}
                        width={185}
                        height={278}
                        loading="lazy"
                        className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg borders"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="w-full">
        {movieCredits.length > 0 && (
          <div className={containerClasses}>
            <span
              className={`text-lg font-semibold px-6 py-2 bg-red-45 rounded-lg text-white
                absolute top-0 translate-y-[-50%]
                ${locale === 'ar' ? 'right-0 -translate-x-[50%]' : 'left-0 translate-x-[50%]'}`}
            >
              {titleTranslation('movies')}
            </span>
            <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
              {visibleMovies.map((movie) => (
                <MediaCard
                  key={`movie-${movie.id}`}
                  item={{
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date ? String(movie.release_date) : undefined,
                  }}
                  mediaType="movie"
                  watchLabel={titleTranslation('watchMovie')}
                />
              ))}
            </div>
            {movieCredits.length > visibleMoviesCount && (
              <Button
                variant="outline"
                onClick={() => setVisibleMoviesCount((c) => c + CREDITS_STEP)}
                className="mt-2"
              >
                {listsT('loadMore')}
              </Button>
            )}
          </div>
        )}

        {tvCredits.length > 0 && (
          <div className={containerClasses}>
            <span
              className={`text-lg font-semibold px-6 py-2 bg-red-45 rounded-lg text-white
                absolute top-0 translate-y-[-50%]
                ${locale === 'ar' ? 'right-0 -translate-x-[50%]' : 'left-0 translate-x-[50%]'}`}
            >
              {titleTranslation('shows')}
            </span>
            <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
              {visibleShows.map((show) => (
                <MediaCard
                  key={`show-${show.id}`}
                  item={{
                    id: show.id,
                    name: show.name,
                    poster_path: show.poster_path,
                    vote_average: show.vote_average,
                    first_air_date: show.first_air_date
                      ? String(show.first_air_date)
                      : undefined,
                  }}
                  mediaType="tv"
                  watchLabel={titleTranslation('watchSeries')}
                />
              ))}
            </div>
            {tvCredits.length > visibleShowsCount && (
              <Button
                variant="outline"
                onClick={() => setVisibleShowsCount((c) => c + CREDITS_STEP)}
                className="mt-2"
              >
                {listsT('loadMore')}
              </Button>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default PersonDetailView;
