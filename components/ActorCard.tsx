import { useMemo } from 'react';
import ReadyTooltip from './ui/ready-tooltip'
import Image from 'next/image'
import { Link } from '@/i18n/routing';

interface ActorCardProps {
  actorId: number;
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

const ActorCard = ({ actorId, actorName, credit_id, profile_path, character, gender, roles }: ActorCardProps) => {
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
      <Link className='w-[100px] h-fit flex flex-col' href={`/browse/person/${actorId}`}>
        <div className='w-[100px] h-[120px] flex'>

          <Image src={imageUrl}
            alt={actorName} className='object-cover rounded-md pointer-events-none' width={100} height={100} loading='lazy' />
        </div>
        <p className='dark:text-gray-50 text-center text-sm truncate'>
          {
            character
          }
        </p>
      </Link>
    </ReadyTooltip>
  )
}




export default ActorCard
