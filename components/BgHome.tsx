import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const BackgroundCollage = () => {

     //for translate 
  const t = useTranslations('Header');

  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=d1e58d52f11cdeb332c4d907dd3ab70b`
        );
        const data = await response.json();
        setPopularMovies(data.results.slice(0, 20)); // Get top 20 movies for the collage
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Movie Posters Background */}
      <div className="absolute inset-0 grid grid-cols-6 gap-1 md:gap-2 transform scale-105">
        {popularMovies.map((movie) => (
          <Image
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            width={200}
            height={300}
            className="object-cover w-full h-full rounded-sm opacity-70"
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>

      {/* Content on Top */}
      <div className="relative z-10 flex items-center justify-center h-full text-white text-7xl font-bold px-4 text-center">
        {t('title')} 
      </div>
    </div>
  );
};

export default BackgroundCollage;
