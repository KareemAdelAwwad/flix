import Image from 'next/image';
import { Series, SeriesImages } from '@/types/series';
import Info from '@/components/ui/Info';
import RatingStars from '@/components/ui/RatingStars';
import { CiCalendar, CiStar } from "react-icons/ci";
import { PiTranslate } from "react-icons/pi";
import { BiCategoryAlt, BiNetworkChart } from "react-icons/bi";
import { CgMusicNote } from "react-icons/cg";

interface SideInfoProps {
  series: Series;
  images: SeriesImages;
  t: (key: string) => string;
  locale: string;
}

export const SideInfo = ({ series, images, t, locale }: SideInfoProps) => {
  return (
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
  );
};