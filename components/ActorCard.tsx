import ReadyTooltip from './ui/ready-tooltip'
import Image from 'next/image'

interface ActorCardProps {
  actorName: string;
  credit_id: string;
  profile_path: string;
  character: string;
  gender: number;
}

const ActorCard = ({actorName, credit_id, profile_path, character, gender}: ActorCardProps) => {
  return (
    <ReadyTooltip title={actorName} key={credit_id}>
      <div className='w-[100px] h-fit flex flex-col'>
        <div className='w-[100px] h-[120px] flex'>

          <Image src={profile_path && gender === 2
          ? `https://image.tmdb.org/t/p/original${profile_path}` 
          : `https://mighty.tools/mockmind-api/content/abstract/${Math.floor(Math.random() * 50) + 1}.jpg`}
            alt={actorName} className='object-cover rounded-md pointer-events-none' width={100} height={100} loading='lazy' />
        </div>
        <p className='text-gray-50 text-center text-sm truncate'>{character}</p>
      </div>
    </ReadyTooltip>
  )
}




export default ActorCard
