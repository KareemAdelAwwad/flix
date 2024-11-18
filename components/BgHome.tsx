import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { setCache, getCache } from '@/utils/cache';

const BackgroundCollage = () => {


  //for translate 
  const t = useTranslations('Header');

  interface Movie {
    id: number;
    poster_path: string;
    title: string;
  }

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  // Movie card animation
  useGSAP(() => {
    gsap.from('#movie-card', {
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.to('#movie-card', {
      delay: 0.2,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })

  }, [popularMovies.length > 0]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`,
    }
  };

  const POPULAR_MOVIES_CACHE_KEY = 'popularMovies';

  const fetchPopularMovies = async (): Promise<Movie[]> => {
    // Check cache first
    const cachedMovies = getCache(POPULAR_MOVIES_CACHE_KEY);
    if (cachedMovies) {
      return cachedMovies as Movie[];
    }

    // If no cache, fetch from API
    const responses = await Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1`, options),
      fetch(`https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=2`, options)
    ]);

    const data = await Promise.all(responses.map(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }));

    const movies = [...data[0].results, ...data[1].results].slice(0, 30);

    // Save to cache
    setCache(POPULAR_MOVIES_CACHE_KEY, movies);
    return movies;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies: Movie[] = await fetchPopularMovies();
        setPopularMovies(movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Set empty array on error to maintain type safety
        setPopularMovies([]);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden pt-2">
      {/* Movie Posters Background */}
      <div className="absolute grid 2xl:grid-cols-10 xl:grid-cols-8 grid-cols-6 flex-wrap gap-6 -skew-x-[20deg] md:-left-[12%] -left-[100%]">
        {popularMovies.map((movie) => (
          <div id='movie-card' key={movie.id} >
            <Image
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              width={160}
              height={240}
              loading='eager'
              className="object-cover w-full h-full rounded-xl opacity-70"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t dark:from-black-8 from-white dark:via-transparent via-transparent dark:to-black-8 to-white"></div>

      {/* Content on Top */}
      <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
        <img src="/logo.png" alt="Logo" width={200} height={200} className='opacity-70' />
      </div>
    </div>
  );
};

export default BackgroundCollage;
