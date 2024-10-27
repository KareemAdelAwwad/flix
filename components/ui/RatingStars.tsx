import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  type?: 'defult' | 'no-outline';
}

const RatingStars = ({ rating, maxRating = 5, type }: RatingStarsProps) => {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  return (
    <div className={`${type !== "no-outline" ? 'hidden sm:flex' : 'flex'} items-center gap-0.5
    ${type !== 'no-outline' ? `bg-black-8 rounded-full px-[12px] py-[6px] border-[1px] border-black-15` : ""}`}>
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < Math.floor(roundedRating);
        const isHalf = !isFilled && index < roundedRating;

        return (
          <div key={index} className="relative">
            {/* Background star (empty) */}
            <Star
              className="w-4 h-4"
              fill="none"
              stroke="#666666"
              strokeWidth={2}
            />

            {/* Foreground star (filled or half-filled) */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: isHalf ? '50%' : '100%' }}
            >
              {(isFilled || isHalf) && (
                <Star
                  className="w-4 h-4 -gray-50"
                  fill="#FF0000"
                  stroke="#FF0000"
                  strokeWidth={2}
                />
              )}
            </div>
          </div>
        );
      })}
      <span className="text-gray-60 ml-1 text-lg font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;