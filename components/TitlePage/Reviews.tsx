import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import { Button } from '@/components/ui/button';
import { FaPlus } from "react-icons/fa6";
import { Review, SliderSettings } from '@/types/series';
import dynamic from 'next/dynamic';

const HorizontalCarousel = dynamic(() => import('@/components/carousel'), {
  loading: () => <div className="animate-pulse bg-black-20 h-32 rounded-lg" />
});

const ReviewCard = dynamic(() => import('@/components/ReviewCard'), {
  loading: () => <div className="animate-pulse bg-black-20 h-48 w-full rounded-lg" />
});

interface ReviewsProps {
  reviews: Review[];
  t: (key: string) => string;
  locale: string;
  sliderSettings: { reviews: SliderSettings };
}

export const Reviews = ({ reviews, t, locale, sliderSettings }: ReviewsProps) => {
  if (reviews.length === 0) return null;

  return (
    <OpenTitleInfoCard className='mb-8' title={t('reviews')}>
      <Button className={`text-lg dark:bg-black-8 bg-gray-50 borders dark:text-white text-black-12 font-medium flex justify-center items-center hover:bg-gray-90 transition-colors duration-300
      absolute top-[40px] ${locale === 'ar' ? 'left-[4rem]' : 'right-[4rem]'}`}>
        <FaPlus /> {t('addreview')}
      </Button>
      <div>
        <HorizontalCarousel
          navStyle='style2'
          data={reviews}
          settings={sliderSettings.reviews}
          ItemComponent={({ item }) => (
            <ReviewCard
              locale={locale}
              id={item.id}
              name={item.author_details.name}
              avatar_path={item.author_details.avatar_path}
              username={item.author_details.username}
              content={item.content}
              rating={item.author_details.rating}
              created_at={item.created_at}
            />
          )}
        />
      </div>
    </OpenTitleInfoCard>
  );
};