import { addReview } from '@/lib/AddReview';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RatingStars from './ui/RatingStars';
import { FlixUsersReviews } from '@/types/title';
import { useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FlixReviewCardProps extends FlixUsersReviews {
  locale: string;
}

const FlixReviewCard: React.FC<FlixReviewCardProps> = ({
  userId,
  firstName,
  avatarUrl,
  rating,
  content,
  lastEditDate,
  titleId,
  titleType,
  locale
}) => {
  const [theContent, setContent] = useState(content);
  const [theRating, setRating] = useState(rating);
  const [expanded, setExpanded] = useState(false);
  const user = useUser();
  const isCurrentUser = user.user?.id === userId;
  const [editingMode, setEditingMode] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const editHandler = () => {
    setEditingMode(!editingMode);

    if (editingMode) {  // Only process when saving (exiting edit mode)
      if (!theContent.trim()) {
        alert('Please enter a review content');
        return;
      }

      // Only call addReview if content or rating changed
      if (theContent !== content || theRating !== rating) {
        addReview(userId, firstName, avatarUrl, titleId, titleType, theContent, theRating);
      }
    }
  };

  useEffect(() => {
    if (editingMode) {
      const reviewContent = document.getElementById('review-content');
      reviewContent?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setEditingMode(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editingMode]);

  const t = useTranslations('TitlePage');
  return (
    <div className='dark:bg-black-6 bg-white p-4 sm:p-6 md:p-10 rounded-xl borders w-full'>
      <div className='flex justify-between items-center mb-5 w-full'>
        <div className={`flex items-center gap-2 ${editingMode && 'hidden sm:flex'}`}>
          <Image
            src={avatarUrl || '/images/robot-image.jpg'}
            alt={firstName}
            width={40}
            height={40}
            className='rounded-full object-cover'
          />
          <div>
            <p className='dark:text-white text-black-6 text-xl'>{firstName}</p>
            <p className='dark:text-gray-60 text-black-30 text-lg'>
              {new Date(lastEditDate).toLocaleDateString(locale, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          {isCurrentUser && (
            <Button className='rounded-full sm:px-4 px-2' onClick={editHandler}>
              {editingMode ? t('savereview') : t('editreview')}
            </Button>
          )}
          <div className='flex items-center gap-2'>
            {editingMode ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => {
                    const starValue = (index + 1) * 2; // Convert to 10-point scale
                    const isHalfHovered =
                      Math.ceil(theRating) === starValue - 1 ||
                      (theRating < starValue && theRating > starValue - 2);
                    const isFullHovered = theRating >= starValue;

                    return (
                      <div
                        key={index}
                        className="relative cursor-pointer"
                        onClick={() => setRating(starValue)}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
                          setRating(starValue - (isLeftHalf ? 1 : 0));
                        }}
                      >
                        {/* Background star (empty) */}
                        <Star
                          className="w-5 h-5"
                          fill="none"
                          stroke="#666666"
                          strokeWidth={2}
                        />

                        {/* Foreground star (filled or half-filled) */}
                        <div
                          className="absolute top-0 overflow-hidden transition-all duration-200"
                          style={{
                            width: isHalfHovered ? '50%' : isFullHovered ? '100%' : '0%'
                          }}
                        >
                          <Star
                            className="w-5 h-5"
                            fill="#FF0000"
                            stroke="#FF0000"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-lg w-8">{(theRating / 2).toFixed(1)}</p>
              </div>
            ) : (
              theRating && <RatingStars rating={theRating / 2} /> || null
            )}
          </div>
        </div>
      </div>
      {editingMode ? (
        <textarea
          required
          id='review-content'
          className='w-full p-2 border border-gray-300 rounded-lg dark:bg-black-6 dark:text-white text-black-30'
          rows={4}
          value={theContent}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <p className='dark:text-gray-60 text-black-30 text-lg'>
          {theContent.length > 160 ? (
            <>
              {expanded ? theContent : theContent.slice(0, 160).split(' ').slice(0, -1).join(' ') + '...'}
              <button onClick={toggleExpanded} className='text-red-60 ml-2'>
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </>
          ) : (
            theContent
          )}
        </p>
      )}
    </div>
  );
};

export default FlixReviewCard;