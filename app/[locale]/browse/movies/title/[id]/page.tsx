
'use client'
import React from 'react'
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import ReadyTooltip from '@/components/ui/ready-tooltip';

// Import Icons
import { FaPlay, FaPlus } from "react-icons/fa6";
import { SlVolume2 } from "react-icons/sl";
import { AiOutlineLike } from "react-icons/ai";
import { IoBookmarkOutline, IoShareSocialOutline } from "react-icons/io5";
import { GoCheckCircle, GoCheckCircleFill } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { PiTranslate, PiFilmReel, PiFilmSlateDuotone } from "react-icons/pi";
import { BiCategoryAlt } from "react-icons/bi";
import { CgMusicNote } from "react-icons/cg";




import HorizontalCarousel from '@/components/carousel'
import ActorCard from '@/components/ActorCard';
import ReviewCard from '@/components/ReviewCard';
import Info from '@/components/ui/Info';
import RatingStars from '@/components/ui/RatingStars';


interface Movie {
  "id": number,
  "imdb_id": string | null,
  "title": string,
  "original_title": string,
  "overview": string,
  "origin_country": string[],
  "original_language": string,
  "adult": boolean,
  "popularity": number,
  "poster_path": string,
  "backdrop_path": string,
  "belongs_to_collection": {
    "id": number,
    "name": string,
    "poster_path": string | null,
    "backdrop_path": string
  },
  "genres": {
    "id": number,
    "name": string
  }[],
  "homepage": string | null,
  "production_companies": {
    "id": number,
    "logo_path": string | null,
    "name": string,
    "origin_country": string
  }[],
  "production_countries": {
    "iso_3166_1": string,
    "name": string
  }[],
  "release_date": string,
  "revenue": number,
  "runtime": number,
  "spoken_languages": {
    "iso_639_1": string,
    "name": string
  }[],
  "status": string,
  "video": boolean,
  "tagline": string,
  "vote_average": number
}
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
interface Cast {
  "id": number,
  "gender": number,
  "name": string,
  "original_name": string,
  "character": string,
  "profile_path": string,
  "credit_id": string,
  "order": number
}[]

interface Review {
  "author_details": {
    "name": string | "",
    "username": string,
    "avatar_path": string | null,
    "rating": number | null
  },
  "content": string,
  "created_at": string,
  "id": string,
}[]

export default function page({ params }: { params: { id: number } }) {
  const [movie, setMovie] = useState({} as Movie);
  const [images, setImages] = useState({} as MovieImages);
  const [cast, setCast] = useState([] as Cast[]);
  const [reviews, setReviews] = useState([] as Review[]);
  const [director, setDirector] = useState({} as Cast);
  const [imageLoaing, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('TitlePage');
  const url = `https://api.themoviedb.org/3/movie/${params.id}?language=${locale}`;
  const imagesUrl = `https://api.themoviedb.org/3/movie/${params.id}/images?language=${locale}&include_image_language=ar,en`;
  const castUrl = `https://api.themoviedb.org/3/movie/${params.id}/credits?language=${locale}`;
  const reviewsUrl = `https://api.themoviedb.org/3/movie/${params.id}/reviews?language=en-US`;
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
  }, [params.id]);

  // Image component that fetches the closest image to the given aspect ratio
  const IMG = (
    { src, height, width, className, ratio }:
      { src: 'backdrops' | 'posters' | 'logos', height: number, width: number, className?: string, ratio: number }) => {

    const closestImage = Array.isArray(images[src]) && images[src].reduce((prev, curr) => {
      return (Math.abs(curr.aspect_ratio - ratio) < Math.abs(prev.aspect_ratio - ratio) ? curr : prev);
    }, images[src][0]);

    return closestImage ? (
      <Image src={`https://image.tmdb.org/t/p/original${closestImage.file_path}`}
        alt={movie.original_title}
        className={`w-full h-full object-cover ${className}`}
        width={closestImage.width || width}
        height={closestImage.height || height}
      />
    ) : null;
  }

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

  return (
    <main className='flex flex-col justify-center items-center gap-20 container'>
      <title>{movie.title}</title>
      {/* Movie Background */}
      <section className='w-full h-[835px] mt-5 rounded-lg overflow-hidden felx justify-center items-center relative'>
        <div className='
        flex flex-col justify-end items-center text-white text-center pb-10
        inset-0 bg-gradient-to-t from-black-8 via-transparent to-transparent w-full h-full absolute z-10'>
          <div>
            <h1 className='text-4xl font-bold'>{movie.title}</h1>
            <p className='text-lg text-gray-60'>{movie.tagline ? movie.tagline : movie.overview}</p>
          </div>
          {/* Movie controles */}
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
            {movie.overview && <p className='text-white'>{movie.overview}</p>}
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
              <Button className='text-lg dark:bg-black-8 border-[1px] dark:border-black-15  dark:text-white font-medium flex justify-center items-center absolute right-[4rem] top-[40px]'>
                <FaPlus /> Add Review
              </Button>
              <div>
                <HorizontalCarousel
                  navStyle='style2'
                  data={reviews}
                  settings={reviewSliderSettings}
                  ItemComponent={({ item }) => (
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
          <div className='dark:bg-black-10 bg-gray-90 rounded-lg p-12 font-semibold text-lg border-[1px] dark:border-black-15 border-gray-75 flex flex-col gap-8'>
            <div className='flex justify-center items-center'>
              <Image loading='lazy' src={`https://image.tmdb.org/t/p/original${images.logos && images.logos[0].file_path}`} alt="Movie Logo" width={240} height={160} />
            </div>
            <Info title={t('releaseDate')}
              content={<p className='dark:text-white text-[16px] font-semibold'>{movie.release_date}</p>}
              icon={<CiCalendar size={24} />} />
            <Info title={t('language')}
              content={
                <div className='flex gap-2.5 flex-wrap'>
                  {
                    movie.spoken_languages && movie.spoken_languages.map((lang, i) => (
                      <span key={i} className='pointer-events-none dark:text-white text-sm font-medium py-[6px] px-3 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-md'>
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
            <Info title={t('director')}
              content={

                <div className='dark:text-white font-medium p-2.5 dark:bg-black-8 bg-gray-50 border-[1px] dark:border-black-15 rounded-lg flex gap-2 items-center'>
                  <div className='w-[48px] h-[50px] overflow-hidden rounded-lg flex justify-center items-center'>
                    <Image src={`https://image.tmdb.org/t/p/original${director.profile_path}`}
                      alt={director.name} className='object-center' width={48} height={48} />
                  </div>
                  <div>
                    <h4 className='text-[16px]'>{director.name}</h4>
                    <p className='text-sm text-gray-60'>{director.name}</p>
                  </div>
                </div>
              }
              icon={<PiFilmReel size={24} />} />
            <Info title={t('music')} content={movie.release_date} icon={<CgMusicNote size={24} />} />
          </div>
        </div>

      </section>


    </main >
  )
}