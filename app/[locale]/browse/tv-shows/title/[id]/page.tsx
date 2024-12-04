'use client'

import React, { Suspense, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl';
import VideoPlayer from '@/components/TitlePage/VideoPlayer';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import dynamic from 'next/dynamic';
import YoutubeVideo from '@/types/youtube';

// Import types
import {
  Series,
  CachedSeasonData,
  SeriesImages,
  SeriesCast,
  Review,
  ImageProps,
  SliderSettings,
  FlixUsersReviews
} from '@/types/title';

// Import Icons
import { FaPlay, FaPlus } from "react-icons/fa6";
import { GoCheckCircle } from "react-icons/go";
import { CiCalendar, CiStar } from "react-icons/ci";
import { PiTranslate, PiFilmSlateDuotone } from "react-icons/pi";
import { BiCategoryAlt, BiNetworkChart } from "react-icons/bi";
import { CgMusicNote } from "react-icons/cg";
import { LuClock4 } from "react-icons/lu";
import { IoPlayCircleOutline } from "react-icons/io5";

// Dynamically import heavy components
const HorizontalCarousel = dynamic(() => import('@/components/carousel'), {
  loading: () => <div className="animate-pulse bg-black-20 h-32 rounded-lg" />
});

const ActorCard = dynamic(() => import('@/components/ActorCard'), {
  loading: () => <div className="animate-pulse bg-black-20 h-24 w-full rounded-lg" />
});

const ReviewCard = dynamic(() => import('@/components/ReviewCard'), {
  loading: () => <div className="animate-pulse bg-black-20 h-48 w-full rounded-lg" />
});

const RatingStars = dynamic(() => import('@/components/ui/RatingStars'));
const Info = dynamic(() => import('@/components/ui/Info'));

// Import Accordion components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Recommendations from '@/components/TitlePage/Recommendations';
import AudioPlayer from '@/components/TitlePage/AudioPlayer';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import Trailer from '@/components/TitlePage/Trailer';
import WatchingServer from '@/components/TitlePage/WatchingServer';
import CompletedButton from '@/components/ui/AddToCompletedButton';
import { generateMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { useUser } from '@clerk/nextjs';
import { fetchReviews } from '@/lib/FetchReviews';
import FlixReviewCard from '@/components/FlixReviewCard';
import AddReviewCard from '@/components/AddReviewCard';

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBase: 'https://image.tmdb.org/t/p/original',
  options: {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  }
} as const;

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong:</h2>
      <pre className="text-red-500 mb-4">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
};

export default function SeriesPage({ params }: { params: { id: number } }) {
  // State management
  const [series, setSeries] = useState<Series>({} as Series);
  const [cachedSeasonData, setCachedSeasonData] = useState<CachedSeasonData>({});
  const [images, setImages] = useState<SeriesImages>({} as SeriesImages);
  const [cast, setCast] = useState<SeriesCast>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ourReviews, setOurReviews] = useState([] as FlixUsersReviews[]);
  const [providers, setProviders] = useState<any>({});
  const [showPlayer, setShowPlayer] = useState(false);
  const [musicList, setMusicList] = useState<YoutubeVideo[]>([]);
  const [addReviewCardStatus, setAddReviewCardStatus] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imdpId, setImdpId] = useState('');
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const locale = useLocale();
  const t = useTranslations('TitlePage');

  // Memoize API URLs
  const urls = useMemo(() => ({
    series: `${API_CONFIG.baseUrl}/tv/${params.id}?language=${locale}`,
    images: `${API_CONFIG.baseUrl}/tv/${params.id}/images?language=${locale}&include_image_language=ar,en`,
    cast: `${API_CONFIG.baseUrl}/tv/${params.id}/aggregate_credits?language=${locale}`,
    reviews: `${API_CONFIG.baseUrl}/tv/${params.id}/reviews?language=en-US`,
    providers: `${API_CONFIG.baseUrl}/tv/${params.id}/watch/providers`,
    imdpId: `${API_CONFIG.baseUrl}/tv/${params.id}/external_ids`,
    youtubeUrl: `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&type=video&q=${series.name}+Song&maxResults=1`,
  }), [params.id, locale]);

  // Fetch data using Promise.all for parallel requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesData, imagesData, reviewsData, castData, , IMDBid] = await Promise.all([
          fetch(urls.series, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetch(urls.images, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetch(urls.reviews, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetch(urls.cast, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetch(urls.providers, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
          fetch(urls.imdpId, API_CONFIG.options).then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          }),
        ]);

        setSeries(seriesData);

        // Process images based on locale
        if (locale === 'ar') {
          ['backdrops', 'posters', 'logos'].forEach(key => {
            if (imagesData[key]) {
              imagesData[key].sort((a: { iso_639_1: string }, b: { iso_639_1: string }) =>
                a.iso_639_1.localeCompare(b.iso_639_1)
              );
            }
          });
        }

        setImages(imagesData);
        setReviews(reviewsData.results);
        setCast(castData.cast.slice(0, 28));
        setProviders(reviewsData.results.EG);
        setImdpId(IMDBid.imdb_id);

      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching data'));
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setImageLoading(false);
      }
    };

    fetchData();
  }, [urls, locale]);

  // Load season data
  const LoadSeasonData = useCallback(async (seasonNumber: number) => {
    if (cachedSeasonData[seasonNumber]) return;

    setEpisodeLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/tv/${params.id}/season/${seasonNumber}?language=${locale}`,
        API_CONFIG.options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCachedSeasonData(prev => ({
        ...prev,
        [seasonNumber]: data
      }));
    } catch (err) {
      console.error('Error loading season data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load season data'));
    } finally {
      setEpisodeLoading(false);
    }
  }, [params.id, locale, cachedSeasonData]);


  // Format runtime utility
  const formatRuntime = useCallback((runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}${t('hour')} ${minutes}${t('minute')}` : `${minutes}${t('minute')}`;
  }, []);

  // Fetch Reviews
  useEffect(() => {
    const fetchReviewsData = async () => {
      const reviewsData = await fetchReviews(series.id.toString());
      setOurReviews(reviewsData);
    }

    fetchReviewsData();
  }, [series.id]);

  const user = useUser();
  const currentUserId = user.user?.id

  const combinedReviews = useMemo(() => [
    ...ourReviews.map(review => ({ ...review, type: 'flix' as const })),
    ...reviews.map(review => ({ ...review, type: 'review' as const }))
  ].sort((a, b) => {
    if (a.type === 'flix' && a.userId === currentUserId) return -1;
    if (b.type === 'flix' && b.userId === currentUserId) return 1;
    if (a.type === 'flix' && b.type === 'review') return -1;
    if (a.type === 'review' && b.type === 'flix') return 1;
    return 0;
  }), [ourReviews, reviews, currentUserId]);

  // Slider settings
  const sliderSettings = useMemo(() => ({
    cast: {
      breakpoints: {
        400: 1,
        520: 2,
        640: 3,
        1200: 4,
        1500: 5,
        1660: 6,
      },
      defaultImagesPerPage: 7
    } as SliderSettings,
    reviews: {
      breakpoints: {
        1520: 1,
      },
      defaultImagesPerPage: 2
    } as SliderSettings
  }), []);


  useEffect(() => {
    if (showPlayer) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPlayer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPlayer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).id === 'player-container') {
      setShowPlayer(false);
    }
  };


  return (
    <main className={`flex flex-col justify-center items-center gap-20 container`}>
      {/* Meta */}
      <title>{series.name}</title>
      <meta name="description" content={series.overview} />
      <meta property="og:title" content={series.name} />
      <meta property="og:description" content={series.overview} />
      <meta property="og:image" content={`https://image.tmdb.org/t/p/original${series.backdrop_path}`} />
      <meta property="og:url" content={`https://flix.kareemadel.com/${locale}/browse/tv/title/${params.id}`} />
      <meta property="og:type" content="TV-Show" />
      <meta property="og:locale" content={locale} />
      {
        showPlayer &&
        <div
          id='player-container'
          onClick={handleContainerClick}
          className="fixed top-0 left-0 right-0 bottom-0 z-[101] flex items-center justify-center
      bg-black-6 bg-opacity-70 w-full h-full">
          <div className="rounded-lg w-[900px] ">
            <VideoPlayer />
          </div>
        </div>
      }

      {/* Meta Tags */}
      <meta name="description" content={series.overview} />
      <meta property="og:title" content={series.name} />
      <meta property="og:description" content={series.overview} />
      {images.backdrops?.[0] && (
        <meta property="og:image" content={`${API_CONFIG.imageBase}${images.backdrops[0].file_path}`} />
      )}

      {/* Series Background */}
      <section className='w-full h-[835px] mt-5 rounded-lg overflow-hidden felx justify-center items-center relative'>
        <div className='
    flex flex-col justify-end items-center text-white text-center pb-10
    inset-0 bg-gradient-to-t dark:from-black-8 from-white via-transparent to-transparent w-full h-full absolute z-10'>
          <div>
            <h1 className='text-4xl font-bold dark:text-white text-black-6'>{series.name}</h1>
            <p className='text-lg dark:text-gray-60 text-black-30'>{series.tagline ? series.tagline : series.overview}</p>
          </div>
          {/* Series controles */}
          <div className='flex justify-center items-center gap-2 w-full h-16 bg-transparent flex-wrap'>
            <ReadyTooltip children={
              <Button
                onClick={() => setShowPlayer(true)}
                className='text-white text-2xl font-bold bg-red-45 hover:bg-red-50 transition-colors duration-400' size="lg">
                <FaPlay /> {t('title')}
              </Button>} title={t('play')} />
            <div className='flex justify-center items-center gap-2'>
              <WatchingServer titleID={imdpId} titleType='tv' status={false} string='Watching Server' />
              {series.id && <WatchlistButton titleId={series.id.toString()} titleType='tv' style='icon' />}
              <Trailer titleName={`${series.original_name} (${new Date(series.first_air_date).getFullYear()})`} status={showTrailer} string={t('trailer')} />
              {
                locale === 'en' && <AudioPlayer songName={`${series.name} - opening`} tooltipTitle={t('themeSong')} />
              }
              {series.id && <CompletedButton titleId={series.id.toString()} titleType='tv' style='icon' />}
            </div>
          </div>
        </div>
        {/* Series Background Image */}
        {
          imageLoading ? null
            : <Image src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
              alt={series.original_title} className='w-full h-full object-cover' height={835} width={1800} />
        }
      </section>


      <section className='w-full flex flex-col lg:flex-row gap-5'>
        {/* Leftside Info */}
        <div className='w-full lg:w-[66%] flex flex-col gap-5'>

          {/* Series Seasons */}
          <OpenTitleInfoCard title={t('seasons')}>
            <Accordion type="single" collapsible>
              {
                series.seasons && series.seasons.sort((a, b) => a.season_number - b.season_number).map(season => (
                  <AccordionItem value={`item-${season.season_number}`}
                    className={`dark:bg-black-6 bg-gray-90 md:px-[50px] px-6 py-2.5 rounded-lg borders ${season.season_number !== 0 && "mt-5"}`}>
                    <AccordionTrigger onClick={() => LoadSeasonData(season.season_number)}>
                      <h4 className='sm:text-xl text-base font-semibold'>{`${t('season')} ${season.season_number.toString().padStart(2, '0')}`}</h4>
                      <p className='sm:text-lg text-sm font-medium text-gray-60'>
                        {`${season.episode_count} ${season.episode_count === 1 ? t('episode') : t('episodes')}`}
                      </p>
                    </AccordionTrigger>

                    <AccordionContent>
                      {episodeLoading ? (
                        <p>{t('loading')}</p>
                      ) : (
                        cachedSeasonData[season.season_number]?.episodes?.map(episode => (
                          <div key={episode.episode_number}
                            className='dark:bg-black-6 bg-gray-90 flex md:flex-row flex-col gap-5 justify-center items-center py-10 border-t-[1px] px-6'>
                            <span className='text-[30px] font-semibold text-gray-60'>
                              {episode.episode_number.toString().padStart(2, '0')}
                            </span>

                            <Suspense fallback={<div className='w-[175px] h-[115px] rounded-md bg-black-20 animate-pulse'>{t('loading')}</div>}>
                              <div
                                onClick={() => setShowPlayer(true)}
                                className='w-[175px] h-[100px] relative rounded-md overflow-hidden borders group cursor-pointer'>

                                <IoPlayCircleOutline size={30}
                                  className='w-14 h-14 p-2 dark:bg-black-6 bg-gray-90 bg-opacity-60 rounded-full text-white group-hover:animate-pulse transition-all duration-300
                                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' />
                                <Image src={episode.still_path ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                                  : `https://placehold.co/300x200.png?text=${episode.name}`}
                                  height={300} width={200} alt={episode.name} className='w-full h-full object-cover pointer-events-none' />
                              </div>
                            </Suspense>

                            <div className='w-5/6'>
                              <div className='flex md:flex-row flex-col justify-between items-center w-full'>
                                <h3 className='text-xl font-semibold'>{episode.name}</h3>
                                <span className='py-2 px-2.5 dark:bg-black-8 bg-gray-50 borders text-[16px] font-medium flex gap-2 rounded text-nowrap'>
                                  <LuClock4 size={20} />
                                  {formatRuntime(episode.runtime)}
                                </span>
                              </div>
                              <p className='text-gray-60 md:pr-10'>{episode.overview}</p>
                            </div>
                          </div>
                        ))
                      )
                      }
                    </AccordionContent>
                  </AccordionItem>
                ))
              }
            </Accordion>
          </OpenTitleInfoCard>



          {/* Series Description */}
          <OpenTitleInfoCard title={t('description')}>
            {series.overview && <p className='dark:text-gray-75 text-black-30'>{series.overview}</p>}
          </OpenTitleInfoCard>


          {/* Cast Carousel */}
          <OpenTitleInfoCard className='mb-8' title={series.genres && series.genres.some(genre => genre.id === 16) ? t('voiceActors') : t('cast')}>
            <div className='overflow-x-clip h-[8rem]'>
              <HorizontalCarousel
                navStyle='style1'
                data={cast}
                settings={sliderSettings.cast}
                ItemComponent={({ item }: { item: any }) => (
                  <ActorCard
                    actorId={item.id}
                    actorName={item.name}
                    credit_id={item.credit_id}
                    profile_path={item.profile_path}
                    roles={item.roles}
                    gender={item.gender}
                    character={item.roles?.[0]?.character}
                  />
                )}
              />
            </div>
          </OpenTitleInfoCard>

          {/* Reviews */}
          <OpenTitleInfoCard className='mb-8' title={t('reviews')}>
            {
              !ourReviews.some(review => review.userId === currentUserId) &&
              <Button
                onClick={() => setAddReviewCardStatus(true)}
                className={`text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center 
                  items-center hover:bg-gray-90 transition-colors duration-300 absolute top-[40px] 
                  ${locale === 'ar' ? 'left-[4rem]' : 'right-[4rem]'}`}>
                <FaPlus /> {t('addreview')}
              </Button>
            }
            <AddReviewCard
              titleType={'tv'}
              titleId={series.id ? series.id.toString() : ''}
              locale={locale}
              isOpen={addReviewCardStatus}
              onClose={() => setAddReviewCardStatus(false)}
            />
            {(combinedReviews && combinedReviews.length > 0) ?
              <div>
                {
                  combinedReviews && combinedReviews.length > 0 &&
                  <HorizontalCarousel
                    navStyle='style2'
                    data={combinedReviews}
                    settings={sliderSettings.reviews}
                    ItemComponent={({ item }: { item: any }) =>
                      item.type === 'flix' ? (
                        <FlixReviewCard
                          userId={item.userId}
                          firstName={item.firstName}
                          avatarUrl={item.avatarUrl}
                          lastEditDate={item.lastEditDate}
                          rating={item.rating}
                          content={item.content}
                          locale={locale}
                          titleId={series.id.toString()}
                          titleType="tv"
                        />
                      ) : (
                        <ReviewCard
                          name={item.author_details.name}
                          username={item.author_details.username}
                          avatar_path={item.author_details.avatar_path}
                          rating={item.author_details.rating}
                          content={item.content}
                          created_at={item.created_at}
                          id={item.id}
                          locale={locale}
                        />
                      )
                    }
                  />
                }
              </div>
              : <p className='dark:text-gray-60 text-black-30 text-center md:px-[15%] px-[5%]'>{t('noreviews')}</p>
            }
          </OpenTitleInfoCard>
        </div>

        {/* Rightside Info */}
        <div className='w-full lg:w-[34%]'>
          <div className='dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg borders flex flex-col gap-8'>
            {
              images.logos && images.logos[0] &&
              <div className='flex justify-center items-center'>
                <Image loading='lazy'
                  src={`https://image.tmdb.org/t/p/original${images.logos[0].file_path}`}
                  alt="Series Logo" width={240} height={160} />
              </div>
            }
            <Info title={t('first_air_date')}
              content={<p className='dark:text-white text-[16px] font-semibold'>{series.first_air_date}</p>}
              icon={<CiCalendar size={24} />} />
            <Info title={t('language')}
              content={
                <div className='flex gap-2.5 flex-wrap'>
                  {
                    series.spoken_languages && series.spoken_languages.map((lang, i) => (
                      <span key={i} className='pointer-events-none dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 borders rounded-md'>
                        {lang.name}
                      </span>
                    ))
                  }
                </div>
              }
              icon={<PiTranslate size={24} />} />
            <Info title={t('rating')}
              content={
                <div className='flex gap-4 flex-col md:flex-row lg:flex-col xl:flex-row overflow-hidden'>
                  <div className='w-full dark:text-white text-sm font-semibold p-3
              dark:bg-black-8 bg-gray-50 borders rounded-lg'>
                    <h6>IMDb</h6>
                    <RatingStars rating={series.vote_average / 2} type='no-outline' />
                  </div>

                  <div className='w-full dark:text-white text-sm font-semibold p-3
              dark:bg-black-8 bg-gray-50 borders rounded-lg'>
                    <h6>Flix APP</h6>
                    <RatingStars rating={series.vote_average / 2} type='no-outline' />
                  </div>
                </div>
              }
              icon={<CiStar size={24} />} />
            <Info title={t('genres')}
              content={
                <div className='flex gap-2.5 flex-wrap'>
                  {
                    series.spoken_languages && series.genres.map((genre, i) => (
                      <span key={i} className='dark:text-white text-sm font-medium py-[6px] px-3
                      dark:bg-black-8 bg-gray-50 borders rounded-md cursor-pointer'>
                        {genre.name}
                      </span>
                    ))
                  }
                </div>
              }
              icon={<BiCategoryAlt size={24} />} />

            <Info title={t('network')}
              content={
                <div className='flex flex-col gap-2'>
                  {
                    series.networks && series.networks.slice(0, 10).map((network) => (
                      <div key={network.id} className='dark:text-white font-medium p-2.5 dark:bg-black-8 bg-gray-50 borders rounded-lg flex gap-4 items-center'>
                        <div className='rounded-lg flex justify-center items-center'>
                          <Image src={`https://image.tmdb.org/t/p/original${network.logo_path}`}
                            alt={network.name} className='object-center' width={100} height={100} />
                        </div>
                        <div>
                          <h4 className='text-[16px]'>{network.name}</h4>
                          {network.origin_country &&
                            <p className='text-sm text-gray-60'>
                              {t('from')} {' '}
                              {new Intl.DisplayNames([locale], { type: 'region' }).of(network.origin_country === 'IS' ? 'PS' : network.origin_country)} {/* فلسطين حرة ❤️ */}
                            </p>}
                        </div>
                      </div>
                    ))
                  }
                </div>
              }
              icon={<BiNetworkChart size={24} />} />

            <Info title={t('music')} content={

              musicList && musicList.map((song) => (
                <div className='dark:text-white font-medium p-2.5 py-2 dark:bg-black-8 bg-gray-50 border-[1px] 
                  dark:border-black-15 rounded-lg flex gap-2 items-center w-full overflow-hidden'>
                  <div className='w-[80px] h-fit overflow-hidden rounded-lg flex justify-center items-center'>
                    <Image src={song.snippet.thumbnails.medium.url}
                      alt={song.snippet.title} className='object-cover w-full h-full' width={200} height={150} />
                  </div>
                  <div className='relative w-full overflow-hidden'>
                    <h4 className='text-[14px] w-[80%] truncate'>{song.snippet.title}</h4>
                  </div>
                </div>
              ))

            } icon={<CgMusicNote size={24} />} />
          </div>
        </div>

      </section>

      <section className='w-full flex flex-col'>

        <Recommendations titleType='tv' titleID={params.id} header={t('recommended')} />
      </section>

    </main >
  )
}
