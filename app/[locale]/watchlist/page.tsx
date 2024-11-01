'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import { fetchWatchlist } from '@/lib/FetchWatchlist';
import { Movie, Series } from '@/types/title';
import { json } from 'stream/consumers';
import Image from 'next/image';
import { Link } from 'lucide-react';

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

  console.log(title);
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
                <Image src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.original_title || 'No title available'} width={250} height={300}
                  className="pointer-events-none" />
            ))}
          </div>
        )}

      </SignedIn>
    </main>
  );
};

export default Page;
