// MoviesShows.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel'; // تأكد من مسار الاستيراد الصحيح
import { Button } from './ui/button';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  runtime?: number; // Optional because we'll fetch it later
  overview?: string; // لإضافة وصف الفيلم
  backdrop_path?: string;
  adult?: boolean;
}

const MoviesShows = () => {
  const t = useTranslations('MoviesShows');
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [romanticMovies, setRomanticMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
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
        setTop10Movies(await addRuntimes(top10Data.results.splice(0, 14)));
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

  const addRuntimes = async (movies: any[]) => {
    return await Promise.all(
      movies.map(async (movie: { id: any; }) => {
        const runtimeRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const movieDetails = await runtimeRes.json();
        return { ...movie, title: movieDetails.title, poster_path: movieDetails.poster_path, runtime: movieDetails.runtime, overview: movieDetails.overview }; // Add runtime and overview to each movie
      })
    );
  };

  const formatRuntime = (runtime: number) => {
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
  const local = useLocale();
  const movieURLFormat = (movie: Movie) => `/${local}/browse/movies/title/${movie.id}`;
  const renderMoviesSection = (title: string, movies: Movie[]) => {
    return (
      <div className='flex flex-col gap-10 my-32'>
        <h2 className="section-title text-3xl font-bold dark:text-white">
          {t(title)}
        </h2>
        <HorizontalCarousel

          data={movies}
          navStyle="style3"
          ItemComponent={({ item }: { item: Movie }) => (

            <div className="relative movie-card group max-w-8">
              <Image
                src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
                alt={item.title}
                width={200}
                height={300}
                className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
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

          )}
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

  // اختيار فيلم مميز
  const featuredMovie = popularMovies[0]; // اختيار أول فيلم من القائمة الشائعة كمثال

  return (
    <main className={`min-h-screen text-red-45 text-black`}>
      <section className="my-10">
        <h2 className="section-title text-3xl text-red-500 font-bold mb-4">{t('featuredMovie')}</h2> {/* عنوان الفيلم المميز باللون الأحمر */}
        {/* عرض الفيلم المميز بصورة كبيرة */}
        {featuredMovie && (
          <div className="relative w-full h-[500px] mb-8"> {/* ارتفاع كبير للفيلم المميز */}
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`} // استخدام صورة بجودة أعلى
              alt={featuredMovie.title}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50 rounded-lg"> {/* محاذاة العناصر إلى المنتصف */}
              <h3 className="text-3xl text-white font-bold">{featuredMovie.title}</h3>
              <p className="text-white mt-2">{featuredMovie.overview || t('noDescription')}</p> {/* وصف الفيلم */}
              <Link href={movieURLFormat(featuredMovie)}>
                <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                  {t('watchFilm')} {/* زر "شاهد الفيلم" */}
                </Button>
              </Link>
            </div>
            <span className="absolute bottom-4 left-4 text-white text-lg"> {/* ساعات العرض في الزاوية اليسرى السفلية */}
              {featuredMovie.runtime ? formatRuntime(featuredMovie.runtime) : t('noRuntime')}
            </span>
          </div>
        )}

        {/* زر "كل الأفلام" وزر الأقسام */}
        <div className="button-container mt-6 flex flex-wrap">
          <button onClick={() => setSelectedSection(null)} className={`bg-gray-700 text-white ${selectedSection === null ? 'active' : ''}`}>
            {t('allMovies')}
          </button>
          <button onClick={() => setSelectedSection('popular')} className={`bg-gray-700 text-white ${selectedSection === 'popular' ? 'active' : ''}`}>
            {t('popularMovies')}
          </button>
          <button onClick={() => setSelectedSection('top10')} className={`bg-gray-700 text-white ${selectedSection === 'top10' ? 'active' : ''}`}>
            {t('top10Movies')}
          </button>
          <button onClick={() => setSelectedSection('trending')} className={`bg-gray-700 text-white ${selectedSection === 'trending' ? 'active' : ''}`}>
            {t('trendingMovies')}
          </button>
          <button onClick={() => setSelectedSection('romantic')} className={`bg-gray-700 text-white ${selectedSection === 'romantic' ? 'active' : ''}`}>
            {t('romanticMovies')}
          </button>
          <button onClick={() => setSelectedSection('action')} className={`bg-gray-700 text-white ${selectedSection === 'action' ? 'active' : ''}`}>
            {t('actionMovies')}
          </button>
        </div>

        {/* عرض كل الأقسام أو القسم المحدد */}
        {selectedSection === null && (
          <>
            {renderMoviesSection('popularMovies', popularMovies)}
            {renderMoviesSection('top10Movies', top10Movies)}
            {renderMoviesSection('trendingMovies', trendingMovies)}
            {renderMoviesSection('romanticMovies', romanticMovies)}
            {renderMoviesSection('actionMovies', actionMovies)}
          </>
        )}

        {selectedSection === 'popular' && renderMoviesSection('popularMovies', popularMovies)}
        {selectedSection === 'top10' && renderMoviesSection('top10Movies', top10Movies)}
        {selectedSection === 'trending' && renderMoviesSection('trendingMovies', trendingMovies)}
        {selectedSection === 'romantic' && renderMoviesSection('romanticMovies', romanticMovies)}
        {selectedSection === 'action' && renderMoviesSection('actionMovies', actionMovies)}
      </section>
    </main>
  );
};

export default MoviesShows;
