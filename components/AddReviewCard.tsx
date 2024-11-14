import React, { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { addReview } from '@/lib/AddReview';
import { useTranslations } from 'next-intl';

interface AddReviewCardProps {
  titleId: string;
  titleType: 'movie' | 'tv';
  locale: string;
  isOpen: boolean;  // renamed from status for clarity
  onClose: () => void;  // add callback to close the modal
}

const AddReviewCard: React.FC<AddReviewCardProps> = ({
  titleId,
  titleType,
  locale,
  isOpen,
  onClose
}) => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert(t('noReviewContentAlert'));
      return;
    }

    if (rating === 0) {
      alert(t('noReviewRatingAlertEdit'));
      return;
    }

    await addReview(
      user?.id || '',
      user?.firstName || '',
      user?.imageUrl || '',
      titleId,
      titleType,
      content,
      rating
    );

    // Reset form and close modal
    setContent('');
    setRating(0);
    onClose();
  };

  const t = useTranslations('TitlePage');
  return isOpen ? (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4'>
      <div className='dark:bg-black-6 bg-white p-4 sm:p-6 md:p-10 rounded-xl borders w-full max-w-2xl'>
        <div className='flex justify-between items-center mb-5 w-full'>
          <div className='flex items-center gap-2'>
            <Image
              src={user?.imageUrl || '/images/robot-image.jpg'}
              alt={user?.firstName || ''}
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
            <div>
              <p className='dark:text-white text-black-6 text-xl'>
                {user?.firstName || ''}
              </p>
              <p className='dark:text-gray-60 text-black-30 text-lg'>
                {new Date().toLocaleDateString(locale, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => {
                const starValue = (index + 1) * 2;
                const isHalfHovered =
                  Math.ceil(rating) === starValue - 1 ||
                  (rating < starValue && rating > starValue - 2);
                const isFullHovered = rating >= starValue;

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
                    <Star
                      className="w-5 h-5"
                      fill="none"
                      stroke="#666666"
                      strokeWidth={2}
                    />
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
            <p className="text-lg w-8">{(rating / 2).toFixed(1)}</p>
          </div>
        </div>
        <textarea
          required
          placeholder={t('writereview')}
          className='w-full p-2 border border-gray-300 rounded-lg dark:bg-black-6 dark:text-white text-black-30'
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className='rounded-full px-6'
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
          <Button
            className='rounded-full px-6'
            onClick={handleSubmit}
          >
            {t('addreview')}
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default React.memo(AddReviewCard);