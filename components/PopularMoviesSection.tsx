import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel';
import { Button } from './ui/button';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  runtime?: number | null;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
}

const MoviesShows = () => {
  const t = useTranslations('MoviesShows');
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const popularRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );

        const popularData = await popularRes.json();
        setPopularMovies(await addRuntimes(popularData.results));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const addRuntimes = async (movies: any[]) => {
    return await Promise.all(
      movies.map(async (movie: { id: any }) => {
        const runtimeRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const movieDetails = await runtimeRes.json();
        const runtime = movieDetails.runtime;

        return {
          ...movie,
          title: movieDetails.title,
          poster_path: movieDetails.poster_path,
          runtime: typeof runtime === 'number' && runtime >= 0 ? runtime : null,
          overview: movieDetails.overview,
          vote_average: movieDetails.vote_average,
        };
      })
    );
  };

  const formatRuntime = (runtime: number | null) => {
    if (runtime === null || isNaN(runtime)) return t('noRuntime');
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const local = useLocale();
  const movieURLFormat = (movie: Movie) => `/${local}/browse/movies/title/${movie.id}`;

  const renderMoviesSection = (title: string, movies: Movie[]) => {
    return (
      <div className='my-12'>
        <h2 className="section-title text-3xl font-bold dark:text-white text-left mb-8">
          {t(title)}
        </h2>
        <HorizontalCarousel
          data={movies}
          navStyle="style3"
          ItemComponent={({ item }: { item: Movie }) => {
            return (
              <div className="relative movie-card group mb-100">
                <div className="aspect-w-2 aspect-h-3">
                  {loading ? (
                    <div className="bg-gray-300 animate-pulse h-full w-full rounded-lg" />
                  ) : (
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
                      alt={item.title}
                      width={200}
                      height={300}
                      className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="movie-card-overlay text-center">
                  <h3 className='movie-title dark:text-white text-black mx-2'>{item.title}</h3>
                  <span className="movie-runtime hidden group-hover:block">
                    {item.runtime ? formatRuntime(item.runtime) : t('noRuntime')}
                  </span>
                  <Link href={movieURLFormat(item)}>
                    <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                      {t('watchFilm')}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          }}
          settings={{
            breakpoints: {
              480: 1,
              700: 2,
              920: 3,
              1130: 4,
              1280: 5,
              1536: 6,
            },
            defaultImagesPerPage: 7,
          }}
        />
      </div>
    );
  };

  const featuredMovie = popularMovies[0];

  return (
      <section className="my-10">
        {/* Only show popular movies section */}
        {renderMoviesSection('popular', popularMovies)}
      </section>
  );
};

export default MoviesShows;
