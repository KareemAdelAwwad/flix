import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { FaStar } from 'react-icons/fa'
import WatchlistButton from '@/components/AddToWatchlistButton'
import { Movie } from '@/types/title'
import { getTranslations } from 'next-intl/server'

const formatRuntime = (runtime: number | null) => {
  if (runtime === null || isNaN(runtime)) return t('noRuntime'); // تحقق من NaN أيضًا
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const t = await getTranslations('MoviesShows');

const MovieWatchCard = ({ item }: { item: Movie }) => {
  return (
    <div className="relative movie-card group max-w-8 mb-100" key={item.id}>
      <div className="aspect-w-2 aspect-h-3">
        <WatchlistButton
          titleId={item.id.toString()}
          titleType="movie"
          style="badge"
          className="text-white"
        />
        <Image
          src={`https://image.tmdb.org/t/p/w780${item.poster_path}`}
          alt={item.title}
          width={200}
          height={300}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="movie-card-overlay text-center">
        <h2 className="text-xl font-bold">{item.title}</h2>
        <Link href={`/browse/movies/title/${item.id}`}>
          <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
            {t('watchMovie')}
          </Button>
        </Link>
        <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">
          <span className="text-white bg-black-60 rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
            {item.runtime ? formatRuntime(item.runtime) : t('noRuntime')}
          </span>
          <span className="text-white bg-black-60 rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
            <FaStar className="inline-block text-yellow-50" />
            {(item.vote_average / 2).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MovieWatchCard
