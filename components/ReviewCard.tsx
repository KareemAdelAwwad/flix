'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import RatingStars from './ui/RatingStars';
import { tmdbAvatar } from '@/utils/tmdbImage';

interface ReviewProps {
  name: string | '';
  username: string;
  avatar_path: string | null;
  rating: number | null;
  content: string;
  created_at: string;
  id: string;
  locale: string;
}

const ReviewCard: React.FC<ReviewProps> = React.memo(
  ({ name, username, avatar_path, rating, content, created_at, locale }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="dark:bg-black-6 bg-white p-4 sm:p-6 md:p-10 rounded-xl borders w-full">
        <div className="flex justify-between items-center mb-5 w-full">
          <div className="flex items-center gap-2">
            <Image
              src={tmdbAvatar(avatar_path)}
              alt={name || username || 'Reviewer avatar'}
              width={40}
              height={40}
              loading="lazy"
              className="rounded-full object-cover w-10 h-10"
            />
            <div>
              <p className="dark:text-white text-black-6 text-xl">{name || username}</p>
              <p className="dark:text-gray-60 text-black-30 text-lg">
                {new Date(created_at).toLocaleDateString(locale, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {rating ? <RatingStars rating={rating / 2} /> : null}
          </div>
        </div>
        <p className="dark:text-gray-60 text-black-30 text-lg">
          {content.length > 160 ? (
            <>
              {expanded
                ? content
                : content.slice(0, 160).split(' ').slice(0, -1).join(' ') + '...'}
              <button onClick={() => setExpanded((prev) => !prev)} className="text-red-60 ml-2">
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </>
          ) : (
            content
          )}
        </p>
      </div>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;