import Image from 'next/image';
import { tmdbImage } from '@/utils/tmdbImage';
import { Movie } from '@/types/title';

interface BackgroundCollageProps {
  movies: Movie[];
}

const BackgroundCollage = ({ movies }: BackgroundCollageProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden pt-2">
      <div className="absolute grid 2xl:grid-cols-10 xl:grid-cols-8 grid-cols-6 flex-wrap gap-6 -skew-x-[20deg] md:-left-[12%] -left-[100%]">
        {movies.map((movie) => (
          <div key={movie.id} className="transition-transform duration-500 ease-out">
            <Image
              src={tmdbImage(movie.poster_path, 'w300')}
              alt={movie.title || 'Movie poster'}
              width={160}
              height={240}
              loading="lazy"
              className="object-cover w-full h-full rounded-xl opacity-70"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t dark:from-black-8 from-white dark:via-transparent via-transparent dark:to-black-8 to-white" />

      <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo" width={200} height={200} className="opacity-70" />
      </div>
    </div>
  );
};

export default BackgroundCollage;
