import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ReadyTooltip from '../ui/ready-tooltip'
import { Button } from '../ui/button'
import { FaPlay, FaPlus } from 'react-icons/fa6'
import { PiFilmSlateDuotone } from 'react-icons/pi'
import { SlVolume2 } from 'react-icons/sl'
import { GoCheckCircle } from 'react-icons/go'

const t = useTranslations('TitlePage');

const Hero = ({
  original_title,
  tagline,
  overview,
  backdrop_path
} : {
  original_title: string;
  tagline: string;
  overview: string;
  backdrop_path: string;
}) => {
  return (
    <section className='w-full h-[835px] mt-5 rounded-lg overflow-hidden felx justify-center items-center relative'>
      <div className='
    flex flex-col justify-end items-center text-white text-center pb-10
    inset-0 bg-gradient-to-t from-black-8 via-transparent to-transparent w-full h-full absolute z-10'>
        <div>
          <h1 className='text-4xl font-bold'>{original_title}</h1>
          <p className='text-lg text-gray-60'>{tagline ? tagline : overview}</p>
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
        <Image src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt={original_title} className='w-full h-full object-cover' height={835} width={1800} />
      }
    </section>
  )
}

export default Hero
