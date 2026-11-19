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
import { tmdbImage } from '@/utils/tmdbImage';
import { MovieDetailBundle } from '@/lib/tmdb';
import { FlixUsersReviews, Movie, MovieCastMember } from '@/types/title';
import { FaPlay, FaPlus } from 'react-icons/fa6';
import { CiCalendar, CiStar } from 'react-icons/ci';
import { PiTranslate, PiFilmReel } from 'react-icons/pi';
import { BiCategoryAlt } from 'react-icons/bi';

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

interface MovieDetailViewProps {
  movie: MovieDetailBundle;
  trailerKey: string | null;
  recommendations: Movie[];
}

export default function MovieDetailView({
  movie,
  trailerKey,
  recommendations,
}: MovieDetailViewProps) {
  const locale = useLocale();
  const t = useTranslations('TitlePage');
  const { user } = useUser();
  const currentUserId = user?.id;

  const [ourReviews, setOurReviews] = useState<FlixUsersReviews[]>([]);
  const [addReviewCardStatus, setAddReviewCardStatus] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const cast = useMemo(() => (movie.credits?.cast || []).slice(0, 28), [movie.credits?.cast]);
  const director = useMemo(
    () => movie.credits?.crew?.find((member) => member.job === 'Director'),
    [movie.credits?.crew]
  );
  const tmdbReviews = useMemo(() => movie.reviews?.results || [], [movie.reviews?.results]);

  const sortedLogos = useMemo(() => {
    const logos = movie.images?.logos || [];
    if (locale !== 'ar') return logos;
    return [...logos].sort((a, b) => (a.iso_639_1 || '').localeCompare(b.iso_639_1 || ''));
  }, [movie.images?.logos, locale]);

  const loadOurReviews = useCallback(async () => {
    if (!movie.id) return;
    try {
      const reviewsData = await fetchReviews(movie.id.toString());
      setOurReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch Flix reviews:', error);
    }
  }, [movie.id]);

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
    ({ item }: { item: MovieCastMember }) => (
      <ActorCard
        actorId={item.id}
        actorName={item.name}
        credit_id={item.credit_id}
        profile_path={item.profile_path}
        character={item.character}
        gender={item.gender}
      />
    ),
    []
  );

  type CombinedReviewItem = (typeof combinedReviews)[number];
  const renderReviewItem = useCallback(
    ({ item }: { item: CombinedReviewItem }) =>
      item.type === 'flix' ? (
        <FlixReviewCard
          {...item}
          locale={locale}
          titleId={movie.id.toString()}
          titleType="movie"
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
    [locale, movie.id]
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

      <section className="w-full h-[835px] mt-5 rounded-t-lg overflow-hidden flex justify-center items-center relative">
        <div className="flex flex-col justify-end items-center text-white text-center pb-10 inset-0 bg-gradient-to-t dark:from-black-8 from-white to-transparent w-full h-full absolute z-10">
          <div className="flex flex-col gap-2 px-4">
            <h1 className="text-4xl font-bold dark:text-white text-black-6">{movie.title}</h1>
            <p className="text-lg dark:text-gray-60 text-black-30 max-w-4xl">
              {movie.tagline || movie.overview}
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
                  titleID={movie.id}
                  titleType="movie"
                  status={false}
                  string="Watching Server"
                />
              )}
              <WatchlistButton titleId={movie.id.toString()} titleType="movie" style="icon" />
              <Trailer
                titleName={movie.title}
                trailerKey={trailerKey}
                status={false}
                string={t('trailer')}
              />
              {movie.title && locale === 'en' && (
                <AudioPlayer
                  songName={`${movie.title} ${
                    movie.release_date ? new Date(movie.release_date).getFullYear() : ''
                  } - Movie - Song`}
                  tooltipTitle={t('themeSong')}
                />
              )}
              <CompletedButton titleId={movie.id.toString()} titleType="movie" style="icon" />
            </div>
          </div>
        </div>

        <Image
          src={tmdbImage(movie.backdrop_path, 'w1280')}
          alt={movie.original_title || movie.title || 'Movie'}
          className="w-full h-full object-cover"
          height={835}
          width={1800}
          priority
        />
      </section>

      <section className="w-full flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[66%] flex flex-col gap-5">
          <OpenTitleInfoCard title={t('description')}>
            {movie.overview && <p className="dark:text-gray-60 text-black-30">{movie.overview}</p>}
          </OpenTitleInfoCard>

          <OpenTitleInfoCard
            className="mb-8"
            title={movie.genres?.some((genre) => genre.id === 16) ? t('voiceActors') : t('cast')}
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
                className={`md:text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center items-center hover:bg-gray-90 transition-colors duration-300 absolute md:top-[40px] top-[30px] ${
                  locale === 'ar' ? 'left-[2rem] md:left-[3rem]' : 'right-[2rem] md:right-[3rem]'
                }`}
              >
                <FaPlus /> {t('addreview')}
              </Button>
            )}
            <AddReviewCard
              titleType="movie"
              titleId={movie.id.toString()}
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
          <div className="dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg border-[1px] dark:border-black-15 border-gray-75 flex flex-col gap-8">
            {sortedLogos.length > 0 && (
              <div className="flex justify-center items-center">
                <Image
                  loading="lazy"
                  src={tmdbImage(sortedLogos[0].file_path, 'w300')}
                  alt="Movie Logo"
                  width={240}
                  height={160}
                />
              </div>
            )}

            <Info
              title={t('releaseDate')}
              content={<p className="dark:text-white text-[16px] font-semibold">{movie.release_date}</p>}
              icon={<CiCalendar size={24} />}
            />

            <Info
              title={t('language')}
              content={
                <div className="flex gap-2.5 flex-wrap">
                  {movie.spoken_languages?.map((lang, i) => (
                    <span
                      key={i}
                      className="pointer-events-none dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-md"
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
                  <div className="w-full dark:text-white text-sm font-semibold p-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg">
                    <h6>IMDb</h6>
                    <RatingStars rating={(movie.vote_average ?? 0) / 2} type="no-outline" />
                  </div>
                  <div className="w-full dark:text-white text-sm font-semibold p-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg">
                    <h6>Flix APP</h6>
                    <RatingStars rating={(movie.vote_average ?? 0) / 2} type="no-outline" />
                  </div>
                </div>
              }
              icon={<CiStar size={24} />}
            />

            <Info
              title={t('genres')}
              content={
                <div className="flex gap-2.5 flex-wrap">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-md cursor-pointer"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              }
              icon={<BiCategoryAlt size={24} />}
            />

            {director && (
              <Info
                title={t('director')}
                content={
                  <div className="dark:text-white font-medium p-2.5 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg flex gap-2 items-center">
                    <div className="w-[48px] h-[50px] overflow-hidden rounded-lg flex justify-center items-center shrink-0">
                      <Image
                        src={tmdbImage(director.profile_path, 'w185', '/images/robot-image.jpg')}
                        alt={director.name}
                        className="object-cover w-full h-full"
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px]">{director.name}</h4>
                      <p className="text-sm text-gray-60">{director.name}</p>
                    </div>
                  </div>
                }
                icon={<PiFilmReel size={24} />}
              />
            )}
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col">
        <Recommendations titleType="movie" items={recommendations} header={t('recommended')} />
      </section>
    </main>
  );
}
