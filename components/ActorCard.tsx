'use client';

import React from 'react';
import ReadyTooltip from './ui/ready-tooltip';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { tmdbImage } from '@/utils/tmdbImage';

interface ActorCardProps {
  actorId: number;
  actorName: string;
  credit_id: string;
  profile_path: string | null;
  gender: number;
  character?: string;
  roles?: {
    character: string;
    episode_count: number;
  }[];
}

const ActorCard: React.FC<ActorCardProps> = React.memo(
  ({ actorId, actorName, credit_id, profile_path, character }) => {
    const imageUrl = tmdbImage(profile_path, 'w185', '/images/no-avatar.svg');

    return (
      <ReadyTooltip title={actorName} key={credit_id}>
        <Link className="w-[100px] h-fit flex flex-col" href={`/browse/person/${actorId}`}>
          <div className="w-[100px] h-[120px] flex overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={actorName}
              className="object-cover w-full h-full rounded-md pointer-events-none"
              width={100}
              height={120}
              loading="lazy"
            />
          </div>
          <p className="dark:text-gray-50 text-center text-sm truncate mt-1">{character}</p>
        </Link>
      </ReadyTooltip>
    );
  }
);

ActorCard.displayName = 'ActorCard';

export default ActorCard;
