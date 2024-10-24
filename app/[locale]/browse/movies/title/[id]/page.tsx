
'use client'
import React from 'react'
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
  "id": number,
  "imdb_id": string | null,
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
  "backdrops"?: {
    "file_path": string,
    "iso_639_1": string,
    "height": number,
    "width": number
  }[],
  "posters": {
    "file_path": string,
    "iso_639_1": string,
    "height": number,
    "width": number
  }[],
  "logos": {
    "file_path": string,
    "iso_639_1": string,
    "height": number,
    "width": number
  }[]
}

export default function page({ params }: { params: { id: number } }) {
  const [movie, setMovie] = useState({} as Movie);
  const [images, setImages] = useState({} as MovieImages);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const url = `https://api.themoviedb.org/3/movie/${params.id}?language=${locale}`;
  const imagesUrl = `https://api.themoviedb.org/3/movie/${params.id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}&include_image_language=ar,en`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  };
  useEffect(() => {
    fetch(url, options)
      .then(res => res.json())
      .then(json => setMovie(json))
      .catch(err => console.error(err));

    fetch(imagesUrl)
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
      .then(() => setLoading(false))
      .catch(err => console.error(err));
  }, [params.id]);

  const IMG = ({ src, height, width, className }: { src: 'backdrops' | 'posters' | 'logos', height: number, width: number, className?: string }) => {
    return <Image src={`https://image.tmdb.org/t/p/original${Array.isArray(images[src]) && images[src][0].file_path}`}
      alt={movie.original_title}
      className={`w-full h-full object-cover ${className}`}
      width={Array.isArray(images[src]) && images[src][0] ? width : images[src]?.[0]?.width || width}
      height={Array.isArray(images[src]) && images[src][0] ? height : images[src]?.[0]?.height || height}
    />
  }
  console.log(images);
  return (
    <main className='flex justify-center items-center'>

      <section className='w-[90%] md:w-[84%] h-[835px] mt-20 rounded-md overflow-hidden bg-black-20 felx justify-center items-center relative'>
        <div className='
        flex flex-col justify-end items-center text-white text-center pb-16
        inset-0 bg-gradient-to-t from-black-8 z-10 via-transparent to-transparent w-full h-full absolute'>
        <h1 className='text-4xl font-bold'>{movie.original_title}</h1>
        <p className='text-lg text-gray-60'>{movie.overview}</p>
        </div>

        {
          loading ? 'Loading...'
            : <IMG src='backdrops' height={835} width={1800} />
        }
      </section>


    </main>
  )
}
