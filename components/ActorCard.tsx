import { useMemo } from 'react';
import ReadyTooltip from './ui/ready-tooltip'
import Image from 'next/image'

interface ActorCardProps {
  actorName: string;
  credit_id: string;
  profile_path: string;
  gender: number;
  character?: string;
  roles?: {
    character: string;
    episode_count: number;
  }[];
}

const ActorCard = ({ actorName, credit_id, profile_path, character, gender, roles }: ActorCardProps) => {
  const placeholderIndex = useMemo(() => {
    return Math.floor(Math.random() * 50) + 1;
  }, []);
  
  const imageUrl = useMemo(() => {
    if (profile_path && gender === 2) {
      return `https://image.tmdb.org/t/p/original${profile_path}`;
    }
    return `https://mighty.tools/mockmind-api/content/abstract/${placeholderIndex}.jpg`;
  }, [profile_path, gender, placeholderIndex]);

  return (
    <ReadyTooltip title={actorName} key={credit_id}>
      <div className='w-[100px] h-fit flex flex-col'>
        <div className='w-[100px] h-[120px] flex'>

          <Image src={imageUrl}
            alt={actorName} className='object-cover rounded-md pointer-events-none' width={100} height={100} loading='lazy' />
        </div>
        <p className='text-gray-50 text-center text-sm truncate'>
          {
            character
          }
        </p>
      </div>
    </ReadyTooltip>
  )
}




export default ActorCard
