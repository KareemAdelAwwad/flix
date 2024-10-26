import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  runtime?: number; // Optional because we'll fetch it later
}

const MoviesShows = () => {
  const t = useTranslations('MoviesShows');
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [romanticMovies, setRomanticMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [selectedSection, setSelectedSection] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const top10Res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const romanticRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d1e58d52f11cdeb332c4d907dd3ab70b&with_genres=10749`);
        const actionRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d1e58d52f11cdeb332c4d907dd3ab70b&with_genres=28`);

        const popularData = await popularRes.json();
        const top10Data = await top10Res.json();
        const trendingData = await trendingRes.json();
        const romanticData = await romanticRes.json();
        const actionData = await actionRes.json();

        setPopularMovies(await addRuntimes(popularData.results));
        setTop10Movies(await addRuntimes(top10Data.results));
        setTrendingMovies(await addRuntimes(trendingData.results));
        setRomanticMovies(await addRuntimes(romanticData.results));
        setActionMovies(await addRuntimes(actionData.results));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to fetch runtime for each movie
  const addRuntimes = async (movies) => {
    return await Promise.all(
      movies.map(async (movie) => {
        const runtimeRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const movieDetails = await runtimeRes.json();
        return { ...movie, runtime: movieDetails.runtime }; // Add runtime to each movie
      })
    );
  };

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-white">{t('loading')}</h2>
      </div>
    );
  }

  const featuredMovie = popularMovies[0];

  const renderSection = () => {
    const sectionMovies =
      selectedSection === 'popular'
        ? popularMovies
        : selectedSection === 'top10'
        ? top10Movies.slice(0, 10)
        : selectedSection === 'trending'
        ? trendingMovies.slice(0, 10)
        : selectedSection === 'romantic'
        ? romanticMovies.slice(0, 10)
        : actionMovies.slice(0, 10);

    return sectionMovies.map((movie, index) => (
      <Link href={`/movies/${movie.id}`} key={movie.id}>
        <div className="relative movie-card group">
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
            alt={movie.title}
            width={200}
            height={300}
            className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="movie-card-overlay">
            <h3 className="movie-title">{movie.title}</h3>
            {/* Display runtime on hover */}
            <span className="movie-runtime hidden group-hover:block">
              {movie.runtime ? formatRuntime(movie.runtime) : t('noRuntime')}
            </span>
            <button className="watch-button" disabled>
              {t('watchFilm')}
            </button>

            {/* Add ranking number for Top 10 movies on hover */}
            {selectedSection === 'top10' && (
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xl font-bold px-3 py-1 rounded-full group-hover:block">
                #{index + 1}
              </span>
            )}
          </div>
        </div>
      </Link>
    ));
  };

  const sectionTitle = selectedSection === 'popular'
    ? t('popularMovies')
    : selectedSection === 'top10'
    ? t('top10Movies')
    : selectedSection === 'trending'
    ? t('trendingMovies')
    : selectedSection === 'romantic'
    ? t('romanticMovies')
    : t('actionMovies');

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Featured Movie Section */}
      <section className="container mx-auto py-5">
        <h2 className="section-title text-3xl font-bold mb-4">{t('featuredMovie')}</h2>
        <div className="relative bg-transparent rounded-lg overflow-hidden">
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

        {/* Section Buttons */}
        <div className="button-container mt-6">
          <button onClick={() => setSelectedSection('popular')} className="bg-gray-700 text-white">
            {t('popularMovies')}
          </button>
          <button onClick={() => setSelectedSection('top10')} className="bg-gray-700 text-white">
            {t('top10Movies')}
          </button>
          <button onClick={() => setSelectedSection('trending')} className="bg-gray-700 text-white">
            {t('trendingMovies')}
          </button>
          <button onClick={() => setSelectedSection('romantic')} className="bg-gray-700 text-white">
            {t('romanticMovies')}
          </button>
          <button onClick={() => setSelectedSection('action')} className="bg-gray-700 text-white">
            {t('actionMovies')}
          </button>
        </div>
      </section>

      {/* Movie Section */}
      <section className="container mx-auto py-8">
        <h2 className="section-title text-3xl font-bold mb-4">{sectionTitle}</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 bg-transparent rounded-lg p-2">
          {renderSection()}
        </div>
      </section>
    </main>
  );
};

export default MoviesShows;
