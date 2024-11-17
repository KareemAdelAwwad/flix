"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel';
import { Button } from '@/components/ui/button';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import { Movie } from '@/types/title';
import { FaStar } from 'react-icons/fa6';


const Page = () => {
  const t = useTranslations('MoviesShows');
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const top10Res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const actionRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=28`);

        const popularData = await popularRes.json();
        const top10Data = await top10Res.json();
        const trendingData = await trendingRes.json();
        const actionData = await actionRes.json();

        setPopularMovies(await addRuntimes(popularData.results));
        setTop10Movies(await addRuntimes(top10Data.results.slice(0, 14))); // تأكد من أنك تريد فقط 14 فيلم
        setTrendingMovies(await addRuntimes(trendingData.results));
        setActionMovies(await addRuntimes(actionData.results));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const addRuntimes = async (movies: any[]) => {
    return await Promise.all(
      movies.map(async (movie: { id: any; }) => {
        const runtimeRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}`);
        const movieDetails = await runtimeRes.json();
        const runtime = movieDetails.runtime;

        // تحقق من أن قيمة runtime صحيحة
        if (typeof runtime !== 'number' || runtime < 0) {
          console.warn(`Invalid runtime for movie ID ${movie.id}:`, runtime);
        }

        // تحقق إذا كانت القيمة NaN
        if (isNaN(runtime)) {
          console.warn(`Runtime is NaN for movie ID ${movie.id}`);
        }

        return { ...movieDetails, runtime };
      })
    );
  };

  const formatRuntime = (runtime: number | null) => {
    if (runtime === null || isNaN(runtime)) return t('noRuntime'); // تحقق من NaN أيضًا
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };


  const locale = useLocale();
  const movieURLFormat = (movie: Movie) => `/${locale}/browse/movies/title/${movie.id}`;

  const renderMoviesSection = (title: string, movies: Movie[]) => {
    return (
      <section id={title} className='my-20 pt-0'>
        <h2 className="text-3xl font-bold  mb-12 ">
          {t(title)}

        </h2>
        <HorizontalCarousel
          data={movies}
          navStyle="style3"
          ItemComponent={({ item }: { item: Movie }) => {
            return (
              <div className="relative movie-card group max-w-8 mb-100">
                <WatchlistButton
                  titleId={item.id.toString()}
                  titleType="movie"
                  style="badge"
                  className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                />
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
                  <h3 className='movie-title dark:text-white text-blac</section>k mx-2'>{item.title}</h3>
                  <Link href={movieURLFormat(item)}>
                    <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                      {t('watchMovie')}
                    </Button>
                  </Link>
                  <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">
                    <span className="text-white bg-black-60 rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
                      {item.runtime ? formatRuntime(item.runtime) : t('noRuntime')}
                    </span>
                    <span className="text-white bg-black-60 rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
                      <FaStar className="inline-block text-yellow-50" />
                      {((item.vote_average ?? 0) / 2).toFixed(1)}
                    </span>
                  </div>
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
      </section>
    );
  };

  const featuredMovie = popularMovies[0];

  return (
    <main className={`text-black container`}>
      <section className="my-10">
        <h2 className="text-3xl  font-bold mb-4">{t('featuredMovie')}</h2>
        {featuredMovie ? (
          <div className="relative w-full h-[500px] mb-8">
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50 rounded-lg bg-gradient-to-t from-black-6 to-transparent">
              <h3 className="text-3xl text-white font-bold">{featuredMovie.title}</h3>
              <p className="text-white mt-2 w-[80vw] md:w-[60vw]">{featuredMovie.tagline || featuredMovie.overview}</p>
              <Link href={movieURLFormat(featuredMovie)}>
                <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                  {t('watchMovie')}
                </Button>
              </Link>
            </div>
            <div className='absolute bottom-4 w-full flex items-center justify-between px-4'>
              <span className=" text-white text-lg">
                {featuredMovie.runtime ? formatRuntime(featuredMovie.runtime) : t('noRuntime')}
              </span>
              <WatchlistButton titleId={featuredMovie.id.toString()} titleType='movie' style='text' />
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-black-30 animate-pulse rounded-lg" />
        )
        }

        {/* <div className="button-container mt-6 flex flex-wrap">
          <Button onClick={() => setSelectedSection(null)} className={`bg-gray-700 text-white ${selectedSection === null ? 'active' : ''}`}>
            {t('allMovies')}
          </Button>
          <Button onClick={() => setSelectedSection('popular')} className={`bg-gray-700 text-white ${selectedSection === 'popular' ? 'active' : ''}`}>
            {t('popular')}
          </Button>
          <Button onClick={() => setSelectedSection('top10')} className={`bg-gray-700 text-white ${selectedSection === 'top10' ? 'active' : ''}`}>
            {t('top10Movies')}
          </Button>
          <Button onClick={() => setSelectedSection('trending')} className={`bg-gray-700 text-white ${selectedSection === 'trending' ? 'active' : ''}`}>
            {t('trendingMovies')}
          </Button>
          <Button onClick={() => setSelectedSection('action')} className={`bg-gray-700 text-white ${selectedSection === 'action' ? 'active' : ''}`}>
            {t('actionMovies')}
          </Button>
        </div> */}

        {/* عرض الأقسام بناءً على الاختيار */}
        {selectedSection === 'popular' && renderMoviesSection('popular', popularMovies)}
        {selectedSection === 'top10' && renderMoviesSection('top10', top10Movies)}
        {selectedSection === 'trending' && renderMoviesSection('trending', trendingMovies)}
        {selectedSection === 'action' && renderMoviesSection('action', actionMovies)}
        {!selectedSection && (
          <>
            {renderMoviesSection('popular', popularMovies)}
            {renderMoviesSection('top10', top10Movies)}
            {renderMoviesSection('trending', trendingMovies)}
            {renderMoviesSection('action', actionMovies)}
          </>
        )}
      </section>
    </main>
  );
};

export default Page;
