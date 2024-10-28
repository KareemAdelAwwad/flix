import OpenTitleInfoCard from '@/components/OpenTitleInfoCard';
import { Series } from '@/types/series';

interface DescriptionProps {
  series: Series;
  t: (key: string) => string;
}

export const Description = ({ series, t }: DescriptionProps) => {
  return (
    <OpenTitleInfoCard title={t('description')}>
      {series.overview && <p className='dark:text-gray-75 text-black-30'>{series.overview}</p>}
    </OpenTitleInfoCard>
  );
};
