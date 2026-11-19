'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@clerk/nextjs';
import { fetchReviews } from '@/lib/FetchReviews';
import { Button } from '@/components/ui/button';
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import HorizontalCarousel, { CarouselSettings } from '@/components/carousel';
import ActorCard from '@/components/ActorCard';
import ReviewCard from '@/components/ReviewCard';
import AddReviewCard from '@/components/AddReviewCard';
import Info from '@/components/ui/Info';
import RatingStars from '@/components/ui/RatingStars';
import Recommendations from '@/components/TitlePage/Recommendations';
import AudioPlayer from '@/components/TitlePage/AudioPlayer';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import Trailer from '@/components/TitlePage/Trailer';
import WatchingServer from '@/components/TitlePage/WatchingServer';
import CompletedButton from '@/components/ui/AddToCompletedButton';
import FlixReviewCard from '@/components/FlixReviewCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { tmdbImage } from '@/utils/tmdbImage';
import { SeriesDetailBundle } from '@/lib/tmdb';
import { CachedSeasonData, FlixUsersReviews, Series, SeriesCastMember } from '@/types/title';
import { FaPlay, FaPlus } from 'react-icons/fa6';
import { CiCalendar, CiStar } from 'react-icons/ci';
import { PiTranslate } from 'react-icons/pi';
import { BiCategoryAlt, BiNetworkChart } from 'react-icons/bi';
import { LuClock4 } from 'react-icons/lu';
import { IoPlayCircleOutline } from 'react-icons/io5';

const VideoPlayer = dynamic(() => import('@/components/TitlePage/VideoPlayer'), {
  ssr: false,
  loading: () => <div className="w-full aspect-video bg-black-10 animate-pulse rounded-lg" />,
});

const CAST_SLIDER_SETTINGS: CarouselSettings = {
  breakpoints: {
    400: 1,
    520: 2,
    640: 3,
    1200: 4,
    1500: 5,
    1660: 6,
  },
  defaultImagesPerPage: 7,
};

const REVIEW_SLIDER_SETTINGS: CarouselSettings = {
  breakpoints: {
    1520: 1,
  },
  defaultImagesPerPage: 2,
};

interface SeriesDetailViewProps {
  series: SeriesDetailBundle;
  trailerKey: string | null;
  imdbId: string;
  recommendations: Series[];
}

export default function SeriesDetailView({
  series,
  trailerKey,
  imdbId,
  recommendations,
}: SeriesDetailViewProps) {
  const locale = useLocale();
  const t = useTranslations('TitlePage');
  const { user } = useUser();
  const currentUserId = user?.id;

  const [cachedSeasonData, setCachedSeasonData] = useState<CachedSeasonData>({});
  const [loadingSeason, setLoadingSeason] = useState<number | null>(null);
  const [ourReviews, setOurReviews] = useState<FlixUsersReviews[]>([]);
  const [addReviewCardStatus, setAddReviewCardStatus] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const cast = useMemo(
    () => (series.aggregate_credits?.cast || []).slice(0, 28),
    [series.aggregate_credits?.cast]
  );
  const tmdbReviews = useMemo(() => series.reviews?.results || [], [series.reviews?.results]);

  const sortedSeasons = useMemo(
    () => [...(series.seasons || [])].sort((a, b) => a.season_number - b.season_number),
    [series.seasons]
  );

  const sortedLogos = useMemo(() => {
    const logos = series.images?.logos || [];
    if (locale !== 'ar') return logos;
    return [...logos].sort((a, b) => (a.iso_639_1 || '').localeCompare(b.iso_639_1 || ''));
  }, [series.images?.logos, locale]);

  const loadSeasonData = useCallback(
    async (seasonNumber: number) => {
      if (cachedSeasonData[seasonNumber]) return;
      setLoadingSeason(seasonNumber);
      try {
        const res = await fetch(
          `/api/tmdb/tv/${series.id}/season/${seasonNumber}?locale=${encodeURIComponent(locale)}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCachedSeasonData((prev) => ({
          ...prev,
          [seasonNumber]: data,
        }));
      } catch (err) {
        console.error('Error loading season data:', err);
      } finally {
        setLoadingSeason(null);
      }
    },
    [series.id, locale, cachedSeasonData]
  );

  const formatRuntime = useCallback(
    (runtime: number) => {
      if (!runtime || isNaN(runtime)) return `—`;
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return hours > 0 ? `${hours}${t('hour')} ${minutes}${t('minute')}` : `${minutes}${t('minute')}`;
    },
    [t]
  );

  const loadOurReviews = useCallback(async () => {
    if (!series.id) return;
    try {
      const reviewsData = await fetchReviews(series.id.toString());
      setOurReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch Flix reviews:', error);
    }
  }, [series.id]);

  useEffect(() => {
    loadOurReviews();
  }, [loadOurReviews]);

  const combinedReviews = useMemo(
    () =>
      [
        ...ourReviews.map((review) => ({ ...review, type: 'flix' as const })),
        ...tmdbReviews.map((review) => ({ ...review, type: 'review' as const })),
      ].sort((a, b) => {
        if (a.type === 'flix' && a.userId === currentUserId) return -1;
        if (b.type === 'flix' && b.userId === currentUserId) return 1;
        if (a.type === 'flix' && b.type === 'review') return -1;
        if (a.type === 'review' && b.type === 'flix') return 1;
        return 0;
      }),
    [ourReviews, tmdbReviews, currentUserId]
  );

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
    if (!showPlayer) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowPlayer(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayer]);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).id === 'player-container') {
      setShowPlayer(false);
    }
  };

  const renderCastItem = useCallback(
    ({ item }: { item: SeriesCastMember }) => (
      <ActorCard
        actorId={item.id}
        actorName={item.name}
        credit_id={item.credit_id}
        profile_path={item.profile_path}
        roles={item.roles}
        gender={item.gender}
        character={item.roles?.[0]?.character}
      />
    ),
    []
  );

  type CombinedReviewItem = (typeof combinedReviews)[number];
  const renderReviewItem = useCallback(
    ({ item }: { item: CombinedReviewItem }) =>
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
      ),
    [locale, series.id]
  );

  const regionNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: 'region' }),
    [locale]
  );

  return (
    <main className="flex flex-col justify-center items-center gap-20 container">
      {showPlayer && (
        <div
          id="player-container"
          onClick={handleContainerClick}
          className="fixed inset-0 z-[101] flex items-center justify-center bg-black-6 bg-opacity-70 w-full h-full"
        >
          <div className="rounded-lg w-[900px] max-w-[95vw]">
            <VideoPlayer />
          </div>
        </div>
      )}

      <section className="w-full h-[835px] mt-5 rounded-lg overflow-hidden flex justify-center items-center relative">
        <div className="flex flex-col justify-end items-center text-white text-center pb-10 inset-0 bg-gradient-to-t dark:from-black-8 from-white via-transparent to-transparent w-full h-full absolute z-10">
          <div className="px-4">
            <h1 className="text-4xl font-bold dark:text-white text-black-6">{series.name}</h1>
            <p className="text-lg dark:text-gray-60 text-black-30 max-w-4xl">
              {series.tagline || series.overview}
            </p>
          </div>
          <div className="flex justify-center items-center gap-2 w-full h-16 bg-transparent flex-wrap">
            <ReadyTooltip title={t('play')}>
              <Button
                onClick={() => setShowPlayer(true)}
                className="text-white text-2xl font-bold bg-red-45 hover:bg-red-50 transition-colors duration-400"
                size="lg"
              >
                <FaPlay /> {t('title')}
              </Button>
            </ReadyTooltip>
            <div className="flex justify-center items-center gap-2">
              {currentUserId === process.env.NEXT_PUBLIC_ADMIN_USER_ID && (
                <WatchingServer
                  titleID={imdbId || series.id}
                  titleType="tv"
                  status={false}
                  string="Watching Server"
                />
              )}
              <WatchlistButton titleId={series.id.toString()} titleType="tv" style="icon" />
              <Trailer
                titleName={`${series.original_name || series.name} (${
                  series.first_air_date ? new Date(series.first_air_date).getFullYear() : ''
                })`}
                trailerKey={trailerKey}
                status={false}
                string={t('trailer')}
              />
              {series.name && locale === 'en' && (
                <AudioPlayer
                  songName={`${series.name} - opening`}
                  tooltipTitle={t('themeSong')}
                />
              )}
              <CompletedButton titleId={series.id.toString()} titleType="tv" style="icon" />
            </div>
          </div>
        </div>

        <Image
          src={tmdbImage(series.backdrop_path, 'w1280')}
          alt={series.original_name || series.name || 'Series'}
          className="w-full h-full object-cover"
          height={835}
          width={1800}
          priority
        />
      </section>

      <section className="w-full flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[66%] flex flex-col gap-5">
          <OpenTitleInfoCard title={t('seasons')}>
            <Accordion type="single" collapsible>
              {sortedSeasons.map((season) => (
                <AccordionItem
                  value={`item-${season.season_number}`}
                  key={season.season_number}
                  className={`dark:bg-black-6 bg-gray-90 md:px-[50px] px-6 py-2.5 rounded-lg borders ${
                    season.season_number !== 0 ? 'mt-5' : ''
                  }`}
                >
                  <AccordionTrigger onClick={() => loadSeasonData(season.season_number)}>
                    <h4 className="sm:text-xl text-base font-semibold">
                      {`${t('season')} ${season.season_number.toString().padStart(2, '0')}`}
                    </h4>
                    <p className="sm:text-lg text-sm font-medium text-gray-60">
                      {`${season.episode_count} ${
                        season.episode_count === 1 ? t('episode') : t('episodes')
                      }`}
                    </p>
                  </AccordionTrigger>

                  <AccordionContent>
                    {loadingSeason === season.season_number ? (
                      <p>{t('loading')}</p>
                    ) : (
                      cachedSeasonData[season.season_number]?.episodes?.map((episode) => (
                        <div
                          key={episode.episode_number}
                          className="dark:bg-black-6 bg-gray-90 flex md:flex-row flex-col gap-5 justify-center items-center py-10 border-t-[1px] px-6"
                        >
                          <span className="text-[30px] font-semibold text-gray-60">
                            {episode.episode_number.toString().padStart(2, '0')}
                          </span>

                          <div
                            onClick={() => setShowPlayer(true)}
                            className="w-[175px] h-[100px] relative rounded-md overflow-hidden borders group cursor-pointer shrink-0"
                          >
                            <IoPlayCircleOutline
                              size={30}
                              className="w-14 h-14 p-2 dark:bg-black-6 bg-gray-90 bg-opacity-60 rounded-full text-white group-hover:animate-pulse transition-all duration-300 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
                            />
                            <Image
                              src={tmdbImage(episode.still_path, 'w300')}
                              height={100}
                              width={175}
                              alt={episode.name}
                              loading="lazy"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </div>

                          <div className="w-5/6">
                            <div className="flex md:flex-row flex-col justify-between items-center w-full">
                              <h3 className="text-xl font-semibold">{episode.name}</h3>
                              <span className="py-2 px-2.5 dark:bg-black-8 bg-gray-50 borders text-[16px] font-medium flex gap-2 rounded text-nowrap">
                                <LuClock4 size={20} />
                                {formatRuntime(episode.runtime)}
                              </span>
                            </div>
                            <p className="text-gray-60 md:pr-10">{episode.overview}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </OpenTitleInfoCard>

          <OpenTitleInfoCard title={t('description')}>
            {series.overview && (
              <p className="dark:text-gray-75 text-black-30">{series.overview}</p>
            )}
          </OpenTitleInfoCard>

          <OpenTitleInfoCard
            className="mb-8"
            title={series.genres?.some((genre) => genre.id === 16) ? t('voiceActors') : t('cast')}
          >
            <div className="overflow-x-clip h-[8rem]">
              <HorizontalCarousel
                navStyle="style1"
                data={cast}
                settings={CAST_SLIDER_SETTINGS}
                ItemComponent={renderCastItem}
              />
            </div>
          </OpenTitleInfoCard>

          <OpenTitleInfoCard className="mb-8" title={t('reviews')}>
            {!ourReviews.some((review) => review.userId === currentUserId) && (
              <Button
                onClick={() => setAddReviewCardStatus(true)}
                className={`text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center items-center hover:bg-gray-90 transition-colors duration-300 absolute top-[40px] ${
                  locale === 'ar' ? 'left-[4rem]' : 'right-[4rem]'
                }`}
              >
                <FaPlus /> {t('addreview')}
              </Button>
            )}
            <AddReviewCard
              titleType="tv"
              titleId={series.id.toString()}
              locale={locale}
              isOpen={addReviewCardStatus}
              onClose={() => {
                setAddReviewCardStatus(false);
                loadOurReviews();
              }}
            />
            {combinedReviews.length > 0 ? (
              <div>
                <HorizontalCarousel
                  navStyle="style2"
                  data={combinedReviews}
                  settings={REVIEW_SLIDER_SETTINGS}
                  ItemComponent={renderReviewItem}
                />
              </div>
            ) : (
              <p className="dark:text-gray-60 text-black-30 text-center md:px-[15%] px-[5%]">
                {t('noreviews')}
              </p>
            )}
          </OpenTitleInfoCard>
        </div>

        <div className="w-full lg:w-[34%]">
          <div className="dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg borders flex flex-col gap-8">
            {sortedLogos.length > 0 && (
              <div className="flex justify-center items-center">
                <Image
                  loading="lazy"
                  src={tmdbImage(sortedLogos[0].file_path, 'w300')}
                  alt="Series Logo"
                  width={240}
                  height={160}
                />
              </div>
            )}

            <Info
              title={t('first_air_date')}
              content={
                <p className="dark:text-white text-[16px] font-semibold">{series.first_air_date}</p>
              }
              icon={<CiCalendar size={24} />}
            />

            <Info
              title={t('language')}
              content={
                <div className="flex gap-2.5 flex-wrap">
                  {series.spoken_languages?.map((lang, i) => (
                    <span
                      key={i}
                      className="pointer-events-none dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 borders rounded-md"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              }
              icon={<PiTranslate size={24} />}
            />

            <Info
              title={t('rating')}
              content={
                <div className="flex gap-4 flex-col md:flex-row lg:flex-col xl:flex-row overflow-hidden">
                  <div className="w-full dark:text-white text-sm font-semibold p-3 dark:bg-black-8 bg-gray-50 borders rounded-lg">
                    <h6>IMDb</h6>
                    <RatingStars rating={(series.vote_average ?? 0) / 2} type="no-outline" />
                  </div>
                  <div className="w-full dark:text-white text-sm font-semibold p-3 dark:bg-black-8 bg-gray-50 borders rounded-lg">
                    <h6>Flix APP</h6>
                    <RatingStars rating={(series.vote_average ?? 0) / 2} type="no-outline" />
                  </div>
                </div>
              }
              icon={<CiStar size={24} />}
            />

            <Info
              title={t('genres')}
              content={
                <div className="flex gap-2.5 flex-wrap">
                  {series.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 borders rounded-md cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              }
              icon={<BiCategoryAlt size={24} />}
            />

            <Info
              title={t('network')}
              content={
                <div className="flex flex-col gap-2">
                  {series.networks?.slice(0, 10).map((network) => (
                    <div
                      key={network.id}
                      className="dark:text-white font-medium p-2.5 dark:bg-black-8 bg-gray-50 borders rounded-lg flex gap-4 items-center"
                    >
                      <div className="rounded-lg flex justify-center items-center">
                        <Image
                          src={tmdbImage(network.logo_path, 'w185')}
                          alt={network.name}
                          className="object-contain"
                          width={100}
                          height={60}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="text-[16px]">{network.name}</h4>
                        {network.origin_country && (
                          <p className="text-sm text-gray-60">
                            {t('from')}{' '}
                            {regionNames.of(
                              network.origin_country === 'IS' ? 'PS' : network.origin_country
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              }
              icon={<BiNetworkChart size={24} />}
            />
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col">
        <Recommendations titleType="tv" items={recommendations} header={t('recommended')} />
      </section>
    </main>
  );
}
