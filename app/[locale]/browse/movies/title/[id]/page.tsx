
'use client'
import { useSubscriptionStore } from '@/store';
import { fetchReviews } from '@/lib/FetchReviews';
import React, { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import ReadyTooltip from '@/components/ui/ready-tooltip';

// Import Icons
import { FaPlay, FaPlus } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { PiTranslate, PiFilmReel } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
// import { CgMusicNote } from "react-icons/cg";

// Import Components
import HorizontalCarousel from '@/components/carousel'
import ActorCard from '@/components/ActorCard';
import ReviewCard from '@/components/ReviewCard';
import AddReviewCard from '@/components/AddReviewCard';
import Info from '@/components/ui/Info';
import RatingStars from '@/components/ui/RatingStars';
import Recommendations from '@/components/TitlePage/Recommendations';
import AudioPlayer from '@/components/TitlePage/AudioPlayer';
import VideoPlayer from '@/components/TitlePage/VideoPlayer';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import Trailer from '@/components/TitlePage/Trailer';
import { Movie, MovieCastMember as Cast, Review, FlixUsersReviews } from '@/types/title';
// import YoutubeVideo from '@/types/youtube';
import WatchingServer from '@/components/TitlePage/WatchingServer';
import CompletedButton from '@/components/ui/AddToCompletedButton';
import FlixReviewCard from '@/components/FlixReviewCard';
import { useUser } from '@clerk/nextjs';

interface MovieImages {
  "id": number,
  "backdrops": {
    "file_path": string,
    "iso_639_1": string,
    'aspect_ratio': number,
    "height": number,
    "width": number
  }[],
  "posters": {
    "file_path": string,
    "iso_639_1": string,
    'aspect_ratio': number,
    "height": number,
    "width": number
  }[],
  "logos": {
    "file_path": string,
    "iso_639_1": string,
    'aspect_ratio': number,
    "height": number,
    "width": number
  }[]
}



export default function page({ params }: { params: { id: number } }) {
  const isSubiscrptionActive = useSubscriptionStore(state => state.isActive);
  const [movie, setMovie] = useState({} as Movie);
  const [images, setImages] = useState({} as MovieImages);
  const [cast, setCast] = useState([] as Cast[]);
  const [reviews, setReviews] = useState([] as Review[]);
  const [ourReviews, setOurReviews] = useState([] as FlixUsersReviews[]);
  const [director, setDirector] = useState({} as Cast);
  // const [musicList, setMusicList] = useState([] as YoutubeVideo[]);
  const [addReviewCardStatus, setAddReviewCardStatus] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [imageLoaing, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('TitlePage');
  const url = `https://api.themoviedb.org/3/movie/${params.id}?language=${locale}`;
  const imagesUrl = `https://api.themoviedb.org/3/movie/${params.id}/images?language=${locale}&include_image_language=ar,en`;
  const castUrl = `https://api.themoviedb.org/3/movie/${params.id}/credits?language=${locale}`;
  const reviewsUrl = `https://api.themoviedb.org/3/movie/${params.id}/reviews?language=en-US`;
  // const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&type=video&q=${movie.title}+Song&maxResults=1`;
  // API request Headers
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  };

  // Fetch movie Data
  useEffect(() => {
    fetch(url, options)
      .then(res => res.json())
      .then(json => setMovie(json))
      .catch(err => console.error(err));

    fetch(imagesUrl, options)
      .then(res => res.json())

      .then(json => {
        if (locale === 'ar') {
          if (json.backdrops) {
            json.backdrops.sort((a: { iso_639_1: string; }, b: { iso_639_1: string; }) => a.iso_639_1.localeCompare(b.iso_639_1));
          }
          if (json.posters) {
            json.posters.sort((a: { iso_639_1: string; }, b: { iso_639_1: string; }) => a.iso_639_1.localeCompare(b.iso_639_1));
          }
          if (json.logos) {
            json.logos.sort((a: { iso_639_1: string; }, b: { iso_639_1: string; }) => a.iso_639_1.localeCompare(b.iso_639_1));
          }
        }
        setImages(json);
      })
      .then(() => setImageLoading(false))
      .catch(err => console.error(err));

    fetch(reviewsUrl, options)
      .then(res => res.json())
      .then(json => setReviews(json.results))
      .catch(err => console.error(err));

    fetch(castUrl, options)
      .then(res => res.json())
      .then(json => {
        setCast(json.cast);
        setDirector(json.crew.find((member: { job: string; }) => member.job === 'Director'));
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [movie.title]);

  // Fetch Reviews
  useEffect(() => {
    if (!movie.id) return;
    const fetchReviewsData = async () => {
      const reviewsData = await fetchReviews(movie.id.toString());
      setOurReviews(reviewsData);
    }

    fetchReviewsData();
  }, [movie.id]);

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


  const castSliderSettings = {
    breakpoints: {
      400: 1,  // Less than 400px -> 1 card
      520: 2,  // Less than 520px -> 2 cards
      640: 3,  // Less than 640px -> 3 cards
      1200: 4, // Less than 1200px -> 4 cards
      1500: 5, // Less than 1500px -> 5 cards
      1660: 6, // Less than 1660px -> 6 cards
    },
    defaultImagesPerPage: 7 // Default when width is larger than all breakpoints
  };
  const reviewSliderSettings = {
    breakpoints: {
      1520: 1,  // Less than 520px -> 1 card
    },
    defaultImagesPerPage: 2 // Default when width is larger than all breakpoints
  };


  // Player Events and Handlers
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

    <main className='flex flex-col justify-center items-center gap-20 container'>
      <title>{movie.title}</title>
      <meta name="description" content={movie.overview} />
      <meta property="og:title" content={movie.title} />
      <meta property="og:description" content={movie.overview} />
      <meta property="og:image" content={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} />
      <meta property="og:url" content={`https://flix.kareemadel.com/${locale}/browse/movies/title/${params.id}`} />
      <meta property="og:type" content="movie" />
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

      {/* Movie Background */}
      <section className='w-full h-[835px] mt-5 rounded-t-lg overflow-hidden felx justify-center items-center relative'>
        <div className='
        flex flex-col justify-end items-center text-white text-center pb-10
        inset-0 bg-gradient-to-t dark:from-black-8 from-white  to-transparent w-full h-full absolute z-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-bold dark:text-white text-black-6'>{movie.title}</h1>
            <p className='text-lg dark:text-gray-60 text-black-30'>{movie.tagline ? movie.tagline : movie.overview}</p>
          </div>
          {/* Movie controles */}
          <div className='flex justify-center items-center gap-2 w-full h-16 bg-transparent flex-wrap'>
            <ReadyTooltip children={
              <Button
                onClick={() => setShowPlayer(true)}
                className='text-white text-2xl font-bold bg-red-45 hover:bg-red-50 transition-colors duration-400' size="lg">
                <FaPlay /> {t('title')}
              </Button>} title={t('play')} />
            <div className='flex justify-center items-center gap-2'>
              {
                isSubiscrptionActive &&
                <WatchingServer titleID={movie.id} titleType='movie' status={false} string='Watching Server' />
              }
              {movie.id && <WatchlistButton titleId={movie.id.toString()} titleType='movie' style='icon' />}
              {movie.title && <Trailer titleName={movie.title} status={showTrailer} string={t('trailer')} />}

              {
                movie.title && movie.title !== '' && movie.title !== 'undefined' &&
                locale === 'en' && <AudioPlayer songName={`${movie.title} - Movie - Song`} tooltipTitle={t('themeSong')} />
              }
              {movie.id && <CompletedButton titleId={movie.id.toString()} titleType='movie' style='icon' />}
            </div>
          </div>
        </div>
        {/* Movie Background Image */}
        {
          imageLoaing ? null
            : <Image src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}

              alt={movie.original_title} className='w-full h-full object-cover' height={835} width={1800} />
        }
      </section>

      <section className='w-full flex flex-col lg:flex-row gap-5'>
        {/* Leftside Info */}
        <div className='w-full lg:w-[66%] flex flex-col gap-5'>

          {/* Movie Description */}
          <OpenTitleInfoCard title={t('description')}>
            {movie.overview && <p className='dark:text-gray-60 text-black-30'>{movie.overview}</p>}
          </OpenTitleInfoCard>


          {/* Cast Carousel */}
          <OpenTitleInfoCard className='mb-8' title={movie.genres && movie.genres.some(genre => genre.id === 16) ? t('voiceActors') : t('cast')}>
            <div className='overflow-x-clip h-[8rem]'>
              <HorizontalCarousel
                navStyle='style1'
                data={cast}
                settings={castSliderSettings}
                ItemComponent={({ item }) => (
                  <ActorCard
                    actorId={item.id}
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
          <OpenTitleInfoCard className='mb-8' title={t('reviews')}>
            {
              !ourReviews.some(review => review.userId === currentUserId) &&
              <Button
                onClick={() => setAddReviewCardStatus(true)}
                className={`md:text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center 
                  items-center hover:bg-gray-90 transition-colors duration-300 absolute md:top-[40px] top-[30px]
                  ${locale === 'ar' ? 'left-[2rem] md:left-[3rem]' : 'right-[2rem] md:right-[3rem]'}`}>
                <FaPlus /> {t('addreview')}
              </Button>
            }
            <AddReviewCard
              titleType={'movie'}
              titleId={movie.id ? movie.id.toString() : ''}
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
                    settings={reviewSliderSettings}
                    ItemComponent={({ item }) =>
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
          <div className='dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg border-[1px] dark:border-black-15 border-gray-75 flex flex-col gap-8'>
            {
              images.logos && images.logos.length > 0
              &&
              <div className='flex justify-center items-center'>
                <Image loading='lazy' src={`https://image.tmdb.org/t/p/original${images.logos && images.logos[0].file_path}`} alt="Movie Logo" width={240} height={160} />
              </div>
            }
            <Info title={t('releaseDate')}
              content={<p className='dark:text-white text-[16px] font-semibold'>{movie.release_date}</p>}
              icon={<CiCalendar size={24} />} />
            <Info title={t('language')}
              content={
                <div className='flex gap-2.5 flex-wrap'>
                  {
                    movie.spoken_languages && movie.spoken_languages.map((lang, i) => (
                      <span key={i} className='pointer-events-none dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-md'>
                        {lang.name && lang.name !== '' && lang.name}
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
              dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg'>
                    <h6>IMDb</h6>
                    <RatingStars rating={movie.vote_average / 2} type='no-outline' />
                  </div>

                  <div className='w-full dark:text-white text-sm font-semibold p-3
              dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg'>
                    <h6>Flix APP</h6>
                    <RatingStars rating={movie.vote_average / 2} type='no-outline' />
                  </div>
                </div>
              }
              icon={<CiStar size={24} />} />
            <Info title={t('genres')}
              content={
                <div className='flex gap-2.5 flex-wrap'>
                  {
                    movie.spoken_languages && movie.genres.map((genre, i) => (
                      <span key={i} className='dark:text-white text-sm font-medium py-[6px] px-3
                      dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-md cursor-pointer'>
                        {genre.name}
                      </span>
                    ))
                  }
                </div>
              }
              icon={<BiCategoryAlt size={24} />} />
            {
              director &&
              <Info title={t('director')}
                content={

                  <div className='dark:text-white font-medium p-2.5 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg flex gap-2 items-center'>
                    <div className='w-[48px] h-[50px] overflow-hidden rounded-lg flex justify-center items-center'>
                      <Image src={director.profile_path ? `https://image.tmdb.org/t/p/original${director.profile_path}` : "/images/robot-image.jpg"}
                        alt={director.name} className='object-center' width={48} height={48} />
                    </div>
                    <div>
                      <h4 className='text-[16px]'>{director.name}</h4>
                      <p className='text-sm text-gray-60'>{director.name}</p>
                    </div>
                  </div>
                }
                icon={<PiFilmReel size={24} />} />
            }
            {/* <Info title={t('music')} content={
              <div className='flex flex-col gap-2.5 flex-wrap'>
                {
                  musicList ? musicList.map((song, i) => (
                    <div key={i} className='dark:text-white font-medium p-2.5 py-2 dark:bg-black-8 bg-gray-50 border-[1px] 
                    dark:border-black-15 rounded-lg flex gap-2 items-center w-full overflow-hidden'>
                      <div className='w-[80px] h-fit overflow-hidden rounded-lg flex justify-center items-center'>
                        <Image src={song.snippet.thumbnails.medium.url}
                          alt={song.snippet.title} className='object-cover w-full h-full' width={200} height={150} />
                      </div>
                      <div className='relative w-full overflow-hidden'>
                        <h4 className='text-[14px] w-[80%] truncate'>{song.snippet.title}</h4>
                      </div>
                    </div>
                  )) : <p className='dark:text-gray-60 text-black-30 text-center md:px-[15%] px-[5%]'>{t('nomusic')}</p>
                }
              </div>
            } icon={<CgMusicNote size={24} />} /> */}
          </div>
        </div>


      </section>

      <section className='w-full flex flex-col'>
        <Recommendations titleType='movie' titleID={params.id} header={t('recommended')} />
      </section>


    </main >
  )
}

