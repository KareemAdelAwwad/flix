"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel';
import { Button } from './ui/button';
import WatchlistButton from './ui/AddToWatchlistButton';
import { Movie } from '@/types/title';
import { FaStar } from 'react-icons/fa6';

const TVShows = () => {
  const t = useTranslations('TVShows');
  const [popularShows, setPopularShows] = useState<Movie[]>([]);
  const [top10Shows, setTop10Shows] = useState<Movie[]>([]);
  const [trendingShows, setTrendingShows] = useState<Movie[]>([]);
  const [actionShows, setActionShows] = useState<Movie[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const popularRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const top10Res = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const actionRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=10759`);

        const popularData = await popularRes.json();
        const top10Data = await top10Res.json();
        const trendingData = await trendingRes.json();
        const actionData = await actionRes.json();

        setPopularShows(popularData.results);
        setTop10Shows(top10Data.results.slice(0, 14));
        setTrendingShows(trendingData.results);
        setActionShows(actionData.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const formatRuntime = (runtime: number | null) => {
    if (runtime === null || isNaN(runtime)) return t('noRuntime');
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const locale = useLocale();
  const showURLFormat = (show: Movie) => `/${locale}/browse/tv/title/${show.id}`;

  const renderShowsSection = (title: string, shows: Movie[]) => {
    return (
      <section id={title} className='my-20 pt-0'>
        <h2 className="text-3xl font-bold mb-12">{t(title)}</h2>
        <HorizontalCarousel
          data={shows}
          navStyle="style3"
          ItemComponent={({ item }: { item: Movie }) => {
            return(
            <div className="relative movie-card group max-w-8 mb-100">
             
              <WatchlistButton
                titleId={item.id.toString()}
                titleType="tv"
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
                <Link href={showURLFormat(item)}>
                  <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                    {t('watchShow')}
                  </Button>
                </Link>
                <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">
                 
                  <span className="text-white bg-black-60 rounded-md px-2 py-1 flex items-center justify-center gap-1">
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

  const featuredShow = popularShows[0];

  return (
    <main className={`text-black`}>
      <section className="my-10">
        <h2 className="text-3xl font-bold mb-4">{t('featuredShow')}</h2>

        {featuredShow ? (
          <div className="relative w-full h-[500px] mb-8">
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
              alt={featuredShow.name}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black bg-opacity-50 rounded-lg bg-gradient-to-t from-black-6 to-transparent">
              <h3 className="text-3xl text-white font-bold">{featuredShow.name}</h3>
              <p className="text-white mt-2 w-[80vw] md:w-[60vw]">{featuredShow.tagline || featuredShow.overview}</p>
              <Link href={showURLFormat(featuredShow)}>
                <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                  {t('watchShow')}
                </Button>
              </Link>
            </div>
            <div className='absolute bottom-4 w-full flex items-center justify-between px-4'>
              <span className=" text-white text-lg">
                {formatRuntime(featuredShow.episode_run_time ? featuredShow.episode_run_time[0] : null)}
              </span>
              <WatchlistButton titleId={featuredShow.id.toString()} titleType='tv' style='text' />
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-black-30 animate-pulse rounded-lg" />
        )}
        <div className="button-container mt-6 flex flex-wrap">
          <Button onClick={() => setSelectedSection(null)} className={`bg-gray-700 text-white ${selectedSection === null ? 'active' : ''}`}>
            {t('allShows')}
          </Button>
          <Button onClick={() => setSelectedSection('popular')} className={`bg-gray-700 text-white ${selectedSection === 'popular' ? 'active' : ''}`}>
            {t('popular')}
          </Button>
          <Button onClick={() => setSelectedSection('top10')} className={`bg-gray-700 text-white ${selectedSection === 'top10' ? 'active' : ''}`}>
            {t('top10')}
          </Button>
          <Button onClick={() => setSelectedSection('trending')} className={`bg-gray-700 text-white ${selectedSection === 'trending' ? 'active' : ''}`}>
            {t('trending')}
          </Button>
          <Button onClick={() => setSelectedSection('action')} className={`bg-gray-700 text-white ${selectedSection === 'action' ? 'active' : ''}`}>
            {t('action')}
          </Button>
        </div>
        {selectedSection === 'popular' && renderShowsSection('popular', popularShows)}
        {selectedSection === 'top10' && renderShowsSection('top10', top10Shows)}
        {selectedSection === 'trending' && renderShowsSection('trending', trendingShows)}
        {selectedSection === 'action' && renderShowsSection('action', actionShows)}
        {!selectedSection && (
          <>
            {renderShowsSection('popular', popularShows)}
            {renderShowsSection('top10', top10Shows)}
            {renderShowsSection('trending', trendingShows)}
            {renderShowsSection('action', actionShows)}
          </>
        )}
      </section>
    </main>
  );
};

export default TVShows;
