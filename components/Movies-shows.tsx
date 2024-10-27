// MoviesShows.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from './carousel'; // تأكد من مسار الاستيراد الصحيح

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  runtime?: number; // Optional because we'll fetch it later
  overview?: string; // لإضافة وصف الفيلم
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
  
  // تحديد حالة الوضع (تغييرها وفقًا لطريقتك)
  const [isDarkMode, setIsDarkMode] = useState(true); // افتراضياً يكون الوضع مظلم

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

  const addRuntimes = async (movies) => {
    return await Promise.all(
      movies.map(async (movie) => {
        const runtimeRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`);
        const movieDetails = await runtimeRes.json();
        return { ...movie, runtime: movieDetails.runtime, overview: movieDetails.overview }; // Add runtime and overview to each movie
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

  const renderMoviesSection = (title: string, movies: Movie[]) => {
    return (
      <>
        <h2 className="section-title text-2xl font-bold mt-6 text-red-500"> {/* لون العنوان أحمر دائمًا */}
          {t(title)}
        </h2>
        <HorizontalCarousel
          data={movies}
          ItemComponent={({ item }: { item: Movie }) => (
            <Link href={`/movies/${item.id}`}>
              <div className="relative movie-card group">
                <Image
                  src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
                  alt={item.title}
                  width={200}
                  height={300}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="movie-card-overlay">
                  <h3 className={`movie-title ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.title}</h3>
                  <span className="movie-runtime hidden group-hover:block">
                    {item.runtime ? formatRuntime(item.runtime) : t('noRuntime')}
                  </span>
                  <button className="watch-button" disabled>
                    {t('watchFilm')}
                  </button>
                </div>
              </div>
            </Link>
          )}
          settings={{
            breakpoints: {
              640: 2,
              768: 3,
              1024: 4,
              1280: 5,
              1536: 6,
            },
            defaultImagesPerPage: 4,
          }}
          navStyle="style2"
        />
      </>
    );
  };

  // اختيار فيلم مميز
  const featuredMovie = popularMovies[0]; // اختيار أول فيلم من القائمة الشائعة كمثال

  return (
    <main className={`bg-black min-h-screen text-red-45 ${isDarkMode ? 'bg-black' : 'bg-white text-black'}`}>
      <section className="container mx-auto py-5">
        <h2 className="section-title text-3xl text-red-500 font-bold mb-4">{t('featuredMovie')}</h2> {/* عنوان الفيلم المميز باللون الأحمر */}
        
        {/* عرض الفيلم المميز بصورة كبيرة */}
        {featuredMovie && (
          <div className="relative w-full h-[500px] mb-8"> {/* ارتفاع كبير للفيلم المميز */}
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`} // استخدام صورة بجودة أعلى
              alt={featuredMovie.title}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50 rounded-lg"> {/* محاذاة العناصر إلى المنتصف */}
              <h3 className="text-3xl text-white font-bold">{featuredMovie.title}</h3>
              <p className="text-white mt-2">{featuredMovie.overview || t('noDescription')}</p> {/* وصف الفيلم */}
              <Link href={`/movies/${featuredMovie.id}`}>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  {t('watchFilm')} {/* زر "شاهد الفيلم" */}
                </button>
              </Link>
            </div>
            <span className="absolute bottom-4 left-4 text-white text-lg"> {/* ساعات العرض في الزاوية اليسرى السفلية */}
              {featuredMovie.runtime ? formatRuntime(featuredMovie.runtime) : t('noRuntime')}
            </span>
          </div>
        )}

        {/* زر "كل الأفلام" وزر الأقسام */}
        <div className="button-container mt-6">
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
