"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import HorizontalCarousel from '@/components/carousel';
import { Button } from '@/components/ui/button';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import { Series } from '@/types/title';
import { FaStar } from 'react-icons/fa6';

const page = () => {
  const t = useTranslations('TVShows');
  const [popularShows, setPopularShows] = useState<Series[]>([]);
  const [top10Shows, setTop10Shows] = useState<Series[]>([]);
  const [trendingShows, setTrendingShows] = useState<Series[]>([]);
  const [airingToday, setAiringToday] = useState<Series[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const popularRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const top10Res = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const airing_today = await fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);

        const popularData = await popularRes.json();
        const top10Data = await top10Res.json();
        const trendingData = await trendingRes.json();
        const airing_todayData = await airing_today.json();

        setPopularShows(await addRuntimes(popularData.results));
        setTop10Shows(await addRuntimes(top10Data.results.slice(0, 14))); // تأكد من أنك تريد فقط 14 فيلم
        setTrendingShows(await addRuntimes(trendingData.results));
        setAiringToday(await addRuntimes(airing_todayData.results));
        setLoading(false);

      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const addRuntimes = async (Shows: any[]) => {
    return await Promise.all(
      Shows.map(async (Shows: { id: any; }) => {
        const runtimeRes = await fetch(`https://api.themoviedb.org/3/tv/${Shows.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}`);
        const ShowsDetails = await runtimeRes.json();
        const runtime = ShowsDetails.runtime;

        if (typeof runtime !== 'number' || runtime < 0) {
          console.warn(`Invalid runtime for Shows ID ${Shows.id}:`, runtime);
        }

        if (isNaN(runtime)) {
          console.warn(`Runtime is NaN for Shows ID ${Shows.id}`);
        }
        return { ...ShowsDetails, runtime };
      })
    );
  };


  const formatRuntime = (episode_run_time: number | null) => {
    if (episode_run_time === null || isNaN(episode_run_time)) return t('noRuntime');
    const hours = Math.floor(episode_run_time / 60);
    const minutes = episode_run_time % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const locale = useLocale();
  const showURLFormat = (show: Series) => `/${locale}/browse/tv-shows/title/${show.id}`;

  const renderShowsSection = (title: string, shows: Series[]) => {
    return (
      <main>
        <title>{t('shows')}</title>
        <section id={title} className='my-20 pt-0'>
          <h2 className="text-3xl font-bold mb-12">{t(title)}</h2>
          <HorizontalCarousel
            data={shows}
            navStyle="style3"
            ItemComponent={({ item }: { item: Series }) => {
              return (
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
                        alt={item.name}
                        width={200}
                        height={300}
                        className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>


                  <div className="movie-card-overlay text-center">
                    <h3 className='movie-title dark:text-white text-black mx-2'>{item.name}</h3>
                    <Link href={showURLFormat(item)}>
                      <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                        {t('watchShow')}
                      </Button>
                    </Link>
                    <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">

                      
                       <span className="text-white bg-black-60 rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
                      {item.episode_run_time ? formatRuntime(item.episode_run_time) : t('noRuntime')}
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
      </main>
    );
  };

  const featuredShow = popularShows[0];

  return (
    <main className="container">
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
                {featuredShow.episode_run_time ? formatRuntime(featuredShow.episode_run_time) : t('noRuntime')}
              </span>
              <WatchlistButton titleId={featuredShow.id.toString()} titleType='tv' style='text' />
            </div>
          </div>
        ) : (
          <div className="h-[500px] bg-black-30 animate-pulse rounded-lg" />
        )}
        {/* <div className="button-container mt-6 flex flex-wrap">
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
          <Button onClick={() => setSelectedSection('airing_today')} className={`bg-gray-700 text-white ${selectedSection === 'airing_today' ? 'active' : ''}`}>
            {t('airing_today')}
          </Button>
        </div> */}
        {selectedSection === 'popular' && renderShowsSection('popular', popularShows)}
        {selectedSection === 'top10' && renderShowsSection('top10', top10Shows)}
        {selectedSection === 'trending' && renderShowsSection('trending', trendingShows)}
        {selectedSection === 'airing_today' && renderShowsSection('airing_today', airingToday)}
        {!selectedSection && (
          <>
            {renderShowsSection('popular', popularShows)}
            {renderShowsSection('top10', top10Shows)}
            {renderShowsSection('trending', trendingShows)}
            {renderShowsSection('airing_today', airingToday)}
          </>
        )}
      </section>
    </main>
  );
};

export default page;
