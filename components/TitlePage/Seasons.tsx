import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Series, CachedSeasonData } from '@/types/title';
import Image from 'next/image';
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuClock4 } from "react-icons/lu";
import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import { Suspense } from "react";

interface SeasonsProps {
  series: Series;
  t: (key: string) => string;
  episodeLoading: boolean;
  cachedSeasonData: CachedSeasonData;
  LoadSeasonData: (seasonNumber: number) => void;
  formatRuntime: (runtime: number) => string;
}

export const Seasons = ({ series, t, episodeLoading, cachedSeasonData, LoadSeasonData, formatRuntime }: SeasonsProps) => {
  return (
    <OpenTitleInfoCard title={t('seasons')}>
      <Accordion type="single" collapsible>
        {series.seasons && series.seasons
          .sort((a, b) => a.season_number - b.season_number)
          .map(season => (
            <AccordionItem
              key={season.season_number}
              value={`item-${season.season_number}`}
              className={`dark:bg-black-6 bg-gray-90 px-[50px] py-2.5 rounded-lg borders ${season.season_number !== 0 && "mt-5"}`}
            >
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
          ))}
      </Accordion>
    </OpenTitleInfoCard>
  );
};