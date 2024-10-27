'use client'

import { Manrope } from 'next/font/google'
import React, { Suspense, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import dynamic from 'next/dynamic';

// Import types
import {
  Series,
  CachedSeasonData,
  SeriesImages,
  Cast,
  Review,
  ImageProps,
  SliderSettings
} from '@/types/series';

// Import Icons
import { FaPlay, FaPlus } from "react-icons/fa6";
import { SlVolume2 } from "react-icons/sl";
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

// Font configuration
const manropes = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
});

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
  const [cast, setCast] = useState<Cast>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const locale = useLocale();
  const t = useTranslations('TitlePage');

  // Memoize API URLs
  const urls = useMemo(() => ({
    series: `${API_CONFIG.baseUrl}/tv/${params.id}?language=${locale}`,
    images: `${API_CONFIG.baseUrl}/tv/${params.id}/images?language=${locale}&include_image_language=ar,en`,
    cast: `${API_CONFIG.baseUrl}/tv/${params.id}/credits?language=${locale}`,
    reviews: `${API_CONFIG.baseUrl}/tv/${params.id}/reviews?language=en-US`
  }), [params.id, locale]);

  // Fetch data using Promise.all for parallel requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesData, imagesData, reviewsData, castData] = await Promise.all([
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
          })
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
        setCast(castData.cast);
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

  // Optimized image component
  const IMG = useCallback(({ src, height, width, className, ratio }: ImageProps) => {
    const closestImage = useMemo(() => {
      if (!Array.isArray(images[src])) return null;
      return images[src].reduce((prev, curr) => {
        return (Math.abs(curr.aspect_ratio - ratio) < Math.abs(prev.aspect_ratio - ratio) ? curr : prev);
      }, images[src][0]);
    }, [src, ratio]);

    if (!closestImage) return null;

    return (
      <Image
        src={`${API_CONFIG.imageBase}${closestImage.file_path}`}
        alt={series.original_title || 'Series image'}
        className={`w-full h-full object-cover ${className}`}
        width={closestImage.width || width}
        height={closestImage.height || height}
        priority={src === 'backdrops'}
        loading={src === 'backdrops' ? 'eager' : 'lazy'}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-image.jpg'; // Add a placeholder image
        }}
      />
    );
  }, [images, series.original_title]);

  // Format runtime utility
  const formatRuntime = useCallback((runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}${t('hour')} ${minutes}${t('minute')}` : `${minutes}${t('minute')}`;
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-screen container">
        <div className="animate-pulse bg-black-20 h-[835px] w-full rounded-lg mb-8" />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  return (
    <main className={`flex flex-col justify-center items-center gap-20 container ${manropes.className}`}>
      {/* Meta */}
      <title>{series.name}</title>
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
        inset-0 bg-gradient-to-t from-black-8 via-transparent to-transparent w-full h-full absolute z-10'>
          <div>
            <h1 className='text-4xl font-bold'>{series.name}</h1>
            <p className='text-lg text-gray-60'>{series.tagline ? series.tagline : series.overview}</p>
          </div>
          {/* Series controles */}
          <div className='flex justify-center items-center gap-2 w-full h-16 bg-transparent flex-wrap'>
            <ReadyTooltip children={<Button className='text-white text-2xl font-bold bg-red-45 hover:bg-red-50 transition-colors duration-400' size="lg">
              <FaPlay /> {t('title')}
            </Button>} title={t('play')} />
            <div className='flex justify-center items-center gap-2'>
              <ReadyTooltip children={<Button size='lgIcon'><FaPlus /></Button>} title={t('watchlist')} />
              <ReadyTooltip children={<Button size='lgIcon'><PiFilmSlateDuotone /></Button>} title={t('trailer')} />
              <ReadyTooltip children={<Button size='lgIcon'><SlVolume2 /></Button>} title={t('themeSong')} />
              <ReadyTooltip children={<Button size='lgIcon'><GoCheckCircle /></Button>} title={t('watched')} />
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
                    className={`dark:bg-black-6 bg-gray-90 px-[50px] py-2.5 rounded-lg borders ${season.season_number !== 0  && "mt-5"}`}>
                    <AccordionTrigger onClick={() => LoadSeasonData(season.season_number)}>
                      <h4 className='text-xl font-semibold'>{`${t('season')} ${season.season_number.toString().padStart(2, '0')}`}</h4>
                      <p className='text-lg font-medium text-gray-60'>
                        {`${season.episode_count} ${season.episode_count === 1 ? t('episode') : t('episodes')}`}
                      </p>
                    </AccordionTrigger>

                    <AccordionContent>
                      {episodeLoading ? (
                        <p>{t('loading')}</p>
                      ) : (
                        cachedSeasonData[season.season_number]?.episodes?.map(episode => (
                          <div key={episode.episode_number}
                            className='dark:bg-black-6 bg-gray-90 flex gap-5 justify-center items-center py-10 border-t-[1px] px-6'>
                            <span className='text-[30px] font-semibold text-gray-60'>
                              {episode.episode_number.toString().padStart(2, '0')}
                            </span>

                            <Suspense fallback={<div className='w-[175px] h-[115px] rounded-md bg-black-20 animate-pulse'>{t('loading')}</div>}>
                              <div className='w-[175px] h-[100px] relative rounded-md overflow-hidden borders group'>

                                <IoPlayCircleOutline size={30}
                                  className='w-14 h-14 p-2 dark:bg-black-6 bg-gray-90 bg-opacity-60 rounded-full text-white group-hover:animate-pulse transition-all duration-300
                                absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' />
                                <Image src={episode.still_path && `https://image.tmdb.org/t/p/original${episode.still_path}`}
                                  height={300} width={200} alt={episode.name} className='w-full h-full object-cover pointer-events-none' />
                              </div>
                            </Suspense>

                            <div className='w-5/6'>
                              <div className='flex justify-between items-center w-full'>
                                <h3 className='text-xl font-semibold'>{episode.name}</h3>
                                <span className='py-2 px-2.5 dark:bg-black-8 bg-gray-50 borders text-[16px] font-medium flex gap-2 rounded text-nowrap'>
                                  <LuClock4 size={20} />
                                  {formatRuntime(episode.runtime)}
                                </span>
                              </div>
                              <p className='text-gray-60 pr-10'>{episode.overview}</p>
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
                    actorName={item.name}
                    credit_id={item.credit_id}
                    profile_path={item.profile_path}
                    character={item.character}
                    gender={item.gender}
                  />
                )}
              />
            </div>
          </OpenTitleInfoCard>

          {/* Reviews */}
          {
            reviews.length > 0 &&
            <OpenTitleInfoCard className='mb-8' title={t('reviews')}>
              <Button className={`text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center items-center hover:bg-gray-90 transition-colors duration-300
              absolute top-[40px] ${locale === 'ar' ? 'left-[4rem]' : 'right-[4rem]'}`}>
                <FaPlus /> {t('addreview')}
              </Button>
              <div>
                <HorizontalCarousel
                  navStyle='style2'
                  data={reviews}
                  settings={sliderSettings.reviews}
                  ItemComponent={({ item }: { item: any }) => (
                    <ReviewCard
                      locale={locale}
                      id={item.id}
                      name={item.author_details.name}
                      avatar_path={item.author_details.avatar_path}
                      username={item.author_details.username}
                      content={item.content}
                      rating={item.author_details.rating}
                      created_at={item.created_at}
                    />
                  )}
                />
              </div>
            </OpenTitleInfoCard>
          }
        </div>

        {/* Rightside Info */}
        <div className='w-full lg:w-[34%]'>
          <div className='dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg borders flex flex-col gap-8'>
            <div className='flex justify-center items-center'>
              <Image loading='lazy' src={`https://image.tmdb.org/t/p/original${images.logos && images.logos[0].file_path}`} alt="Series Logo" width={240} height={160} />
            </div>
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
                series.networks && series.networks.map((network) => (
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
              icon={<BiNetworkChart size={24} />} />

            <Info title={t('music')} content={series.first_air_date} icon={<CgMusicNote size={24} />} />
          </div>
        </div>

      </section>


    </main >
  )
}
