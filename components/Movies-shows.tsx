import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const MoviesShows = () => {
  const t = useTranslations('MoviesShows'); // تحريك useTranslations داخل المكون
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`
        );
        const top10Res = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`
        );
        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`
        );

        const popularData = await popularRes.json();
        const top10Data = await top10Res.json();
        const trendingData = await trendingRes.json();

        setPopularMovies(popularData.results);
        setTop10Movies(top10Data.results);
        setTrendingMovies(trendingData.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-white">{t('loading')}</h2>
      </div>
    );
  }

  const featuredMovie = popularMovies[0];

  return (
    <main className="bg-black min-h-screen text-white">
      {/* قسم الفيلم المميز */}
      <section className="container mx-auto py-5">
        <h2 className="text-3xl font-bold mb-4 text-red-500">{t('featuredMovie')}</h2>
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${featuredMovie.poster_path}`}
            alt={featuredMovie.title}
            width={1200}
            height={500}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <h3 className="text-4xl font-bold mb-4 text-white">{featuredMovie.title}</h3>
            <p className="text-lg mb-4">{t('enjoyFeatured')}</p>
            <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-300" disabled>
              {t('watchFilm')}
            </button>
          </div>
        </div>
      </section>

      {/* قسم الأفلام الأعلى تقييماً */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-4 text-red-500">{t('top10Movies')}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 bg-gray-900 rounded-lg p-2">
          {top10Movies.slice(0, 10).map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden min-w-[200px] shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300" disabled>
                    {t('watchFilm')}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* قسم الأفلام الشعبية */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-4 text-red-500">{t('popularMovies')}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 bg-gray-900 rounded-lg p-2">
          {popularMovies.slice(1).map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden min-w-[200px] shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300" disabled>
                    {t('watchFilm')}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* قسم الأفلام المتداولة */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-4 text-red-500">{t('trendingMovies')}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 bg-gray-900 rounded-lg p-2">
          {trendingMovies.slice(0, 10).map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden min-w-[200px] shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300" disabled>
                    {t('watchFilm')}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MoviesShows;
