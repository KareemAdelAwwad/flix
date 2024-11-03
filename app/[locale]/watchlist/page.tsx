'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import { fetchWatchlist } from '@/lib/FetchWatchlist';
import { Movie, Series } from '@/types/title';
import Image from 'next/image';

interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
}

const Page = () => {
  const locale = useLocale();
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  };
  const [title, setTitle] = useState([] as (Movie | Series)[]);
  const [watchlist, setWatchlist] = useState([] as WatchlistItem[]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null); // Track hovered item

  useEffect(() => {
    if (!userId) return;

    const loadWatchlist = async () => {
      try {
        const data = await fetchWatchlist(userId);
        setWatchlist(data);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      }
    };

    loadWatchlist();
  }, [userId]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const titlePromises = watchlist.map(item =>
          fetch(`https://api.themoviedb.org/3/${item.titleType}/${item.titleId}?language=${locale}`, options)
            .then(response => response.json())
        );
        const titleData = await Promise.all(titlePromises);
        setTitle(titleData);
      } catch (error) {
        console.error('Error fetching watchlist movies data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [watchlist]);

  const handleRemoveFromWatchlist = (titleId: string) => {
    setWatchlist(prev => prev.filter(item => item.titleId !== titleId));
    setTitle(prev => prev.filter(item => item.id !== titleId)); // Assuming 'id' is the field in your title data
  };

  const getButtonLabel = () => {
    return locale === 'ar' ? 'شاهد الفيلم' : 'Watch Film';
  };

  if (loading) return <p>Loading your watchlist...</p>;

  return (
    <main className='container'>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <h1>Your Watchlist</h1>

        {title.length === 0 ? (
          <p>Your watchlist is empty!</p>
        ) : (
          <div className='flex flex-row flex-wrap gap-6'>
            {title.map(item => (
              <div 
                key={item.id} 
                className="relative group" 
                onMouseEnter={() => setHoveredItem(item.id)} 
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Image 
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.original_title || 'No title available'} 
                  width={250} 
                  height={300}
                  className="pointer-events-none"
                />
                {hoveredItem === item.id && (
                  <>
                    <button 
                      onClick={() => handleRemoveFromWatchlist(item.id)} 
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                    <button className="absolute bottom-0 left-0 bg-blue-500 text-white py-1 px-2 rounded">
                      {getButtonLabel()}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </main>
  );
};

export default Page;
