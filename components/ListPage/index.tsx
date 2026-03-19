'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useLocale, useTranslations } from 'next-intl';
import { Movie, Series } from '@/types/title';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FaStar, FaFilm, FaTv } from "react-icons/fa";
import firebase from 'firebase/compat/app';

// Types
interface ListItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt?: Date;
}

interface TitleWithLoading {
  id: string;
  data: Movie | Series | null;
  loading: boolean;
  type: 'movie' | 'tv';
}

interface PaginatedResult {
  items: ListItem[];
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  hasMore: boolean;
}

interface ActionButtonProps {
  titleId: string;
  titleType: 'movie' | 'tv';
  style: 'icon' | 'text' | 'badge';
  className?: string;
}

interface ListPageProps {
  pageType: 'watchlist' | 'watched';
  pageTitle: string;
  emptyMessage: string;
  fetchData: (userId: string, lastDoc?: firebase.firestore.QueryDocumentSnapshot | null) => Promise<PaginatedResult>;
  subscribeToData: (
    userId: string, 
    onUpdate: (items: ListItem[]) => void,
    onError?: (error: Error) => void
  ) => () => void;
  ActionButton: React.ComponentType<ActionButtonProps>;
}

// Skeleton Card Component (matching original movie-card style)
const SkeletonCard = () => (
  <div className="relative movie-card max-w-8 mb-100 animate-pulse">
    <div className="aspect-w-2 aspect-h-3">
      <div className="w-full h-[300px] bg-gray-700 rounded-lg" />
    </div>
    <div className="mt-2 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

// Title Card Component (using original movie-card design)
const TitleCard = ({ 
  item, 
  type,
  formatRuntime, 
  t,
  ActionButton
}: { 
  item: Movie | Series;
  type: 'movie' | 'tv';
  formatRuntime: (runtime: number | null | number[]) => string;
  t: (key: string) => string;
  ActionButton: React.ComponentType<ActionButtonProps>;
}) => {
  const isMovie = type === 'movie';
  const title = isMovie ? (item as Movie).title : (item as Series).name;
  const runtime = isMovie 
    ? (item as Movie).runtime 
    : (item as Series).episode_run_time;
  const linkPath = isMovie 
    ? `/browse/movies/title/${item.id}` 
    : `/browse/tv-shows/title/${item.id}`;

  return (
    <div className="relative movie-card group max-w-8 mb-100">
      <div className="aspect-w-2 aspect-h-3">
        <ActionButton
          titleId={item.id.toString()}
          titleType={type}
          style="badge"
          className="text-white"
        />
        <Image
          src={item.poster_path 
            ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
            : '/images/no-poster.png'}
          alt={title || 'Title'}
          width={200}
          height={300}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="movie-card-overlay text-center">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <Link href={linkPath}>
          <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
            {isMovie ? t('watchMovie') : t('watchSeries')}
          </Button>
        </Link>
        <div className="flex justify-between items-center absolute bottom-2.5 w-full px-4">
          <span className="text-white rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
            {formatRuntime(runtime)}
          </span>
          <span className="text-white rounded-md px-2 py-1 bg-black-6 flex items-center justify-center gap-1">
            <FaStar className="inline-block text-yellow-50" />
            {(item.vote_average / 2).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  count 
}: { 
  active: boolean; 
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
      ${active 
        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }
    `}
  >
    <Icon className="text-lg" />
    <span>{label}</span>
    <span className={`
      px-2 py-0.5 rounded-full text-xs font-semibold
      ${active 
        ? 'bg-white/20 text-white' 
        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
      }
    `}>
      {count}
    </span>
  </button>
);

// Main List Page Component
export default function ListPage({ 
  pageTitle, 
  emptyMessage,
  fetchData,
  subscribeToData,
  ActionButton
}: ListPageProps) {
  const locale = useLocale();
  const { userId } = useAuth();
  const t = useTranslations('MoviesShows');
  const pTranslation = useTranslations('Lists');

  // State
  const [activeTab, setActiveTab] = useState<'movies' | 'shows'>('movies');
  const [allTitles, setAllTitles] = useState<TitleWithLoading[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lastDocRef = useRef<firebase.firestore.QueryDocumentSnapshot | null>(null);
  const loadedIdsRef = useRef<Set<string>>(new Set());

  // Memoized API options
  const options = useMemo(() => ({
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  }), []);

  // Fetch title data from TMDB
  const fetchTitleData = useCallback(async (item: ListItem): Promise<TitleWithLoading> => {
    const endpoint = item.titleType === 'movie' 
      ? `https://api.themoviedb.org/3/movie/${item.titleId}?language=${locale}`
      : `https://api.themoviedb.org/3/tv/${item.titleId}?language=${locale}`;
    
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return { id: item.titleId, data, loading: false, type: item.titleType };
    } catch (error) {
      console.error(`Error fetching ${item.titleType} ${item.titleId}:`, error);
      return { id: item.titleId, data: null, loading: false, type: item.titleType };
    }
  }, [locale, options]);

  // Fetch titles progressively in batches
  const fetchTitlesProgressively = useCallback(async (
    items: ListItem[], 
    append: boolean = false
  ) => {
    // Filter out already loaded items to prevent duplicates
    const newItems = items.filter(item => {
      const uniqueKey = `${item.titleType}-${item.titleId}`;
      if (loadedIdsRef.current.has(uniqueKey)) {
        return false;
      }
      loadedIdsRef.current.add(uniqueKey);
      return true;
    });

    if (newItems.length === 0) return;

    // Add loading placeholders
    const placeholders: TitleWithLoading[] = newItems.map(item => ({ 
      id: item.titleId, 
      data: null, 
      loading: true, 
      type: item.titleType 
    }));

    if (append) {
      setAllTitles(prev => [...prev, ...placeholders]);
    } else {
      setAllTitles(placeholders);
    }

    // Fetch in batches of 4
    const batchSize = 4;
    for (let i = 0; i < newItems.length; i += batchSize) {
      const batch = newItems.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(item => fetchTitleData(item)));
      
      setAllTitles(prev => {
        const updated = [...prev];
        results.forEach(result => {
          const uniqueKey = `${result.type}-${result.id}`;
          const index = updated.findIndex(t => `${t.type}-${t.id}` === uniqueKey && t.loading);
          if (index !== -1) {
            updated[index] = result;
          }
        });
        return updated;
      });
    }
  }, [fetchTitleData]);

  // Initial load
  useEffect(() => {
    if (!userId) return;

    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        loadedIdsRef.current.clear();
        
        const result = await fetchData(userId);
        lastDocRef.current = result.lastDoc;
        setHasMore(result.hasMore);
        
        if (result.items.length > 0) {
          await fetchTitlesProgressively(result.items, false);
        }

      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load your items. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitial();

    // Subscribe to realtime updates (only for first page additions)
    const unsubscribe = subscribeToData(
      userId,
      async (items) => {
        // Check for new items that we don't have
        const newItems = items.filter(item => {
          const uniqueKey = `${item.titleType}-${item.titleId}`;
          return !loadedIdsRef.current.has(uniqueKey);
        });
        
        if (newItems.length > 0) {
          await fetchTitlesProgressively(newItems, true);
        }
      },
      (error) => {
        console.error('Real-time subscription error:', error);
        if (error.message.includes('index')) {
          console.warn('Firestore index not created. Real-time updates disabled.');
        }
      }
    );

    return () => unsubscribe();
  }, [userId, fetchData, subscribeToData, fetchTitlesProgressively]);

  // Load more function
  const loadMore = async () => {
    if (!userId || loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const result = await fetchData(userId, lastDocRef.current);
      
      lastDocRef.current = result.lastDoc;
      setHasMore(result.hasMore);
      
      if (result.items.length > 0) {
        await fetchTitlesProgressively(result.items, true);
      }
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Format runtime
  const formatRuntime = (runtime: number | null | number[] | undefined) => {
    if (!runtime) return t('noRuntime');
    const value = Array.isArray(runtime) ? runtime[0] : runtime;
    if (!value || isNaN(value)) return t('noRuntime');
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Filter titles by type
  const movieTitles = allTitles.filter(t => t.type === 'movie');
  const seriesTitles = allTitles.filter(t => t.type === 'tv');
  
  const loadedMovies = movieTitles.filter(t => !t.loading && t.data);
  const loadingMovies = movieTitles.filter(t => t.loading);
  const loadedSeries = seriesTitles.filter(t => !t.loading && t.data);
  const loadingSeries = seriesTitles.filter(t => t.loading);

  const currentLoaded = activeTab === 'movies' ? loadedMovies : loadedSeries;
  const currentLoading = activeTab === 'movies' ? loadingMovies : loadingSeries;

  return (
    <main className="container min-h-screen pb-16">
      <title>{pageTitle}</title>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center dark:text-white text-gray-900">
            {pageTitle}
          </h1>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <TabButton
            active={activeTab === 'movies'}
            onClick={() => setActiveTab('movies')}
            icon={FaFilm}
            label={t('movies')}
            count={movieTitles.length}
          />
          <TabButton
            active={activeTab === 'shows'}
            onClick={() => setActiveTab('shows')}
            icon={FaTv}
            label={t('shows')}
            count={seriesTitles.length}
          />
        </div>

        {/* Content */}
        {initialLoading ? (
          <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {currentLoaded.length === 0 && currentLoading.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-7xl mb-6">
                  {activeTab === 'movies' ? '🎬' : '📺'}
                </div>
                <p className="text-gray-500 text-lg mb-6 text-center">
                  {emptyMessage}
                </p>
                <Link href={activeTab === 'movies' ? '/browse/movies' : '/browse/tv-shows'}>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    {activeTab === 'movies' ? t('browseMovies') : t('browseShows')}
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
                  {currentLoaded.map(item => (
                    <TitleCard
                      key={`${item.type}-${item.id}`}
                      item={item.data as Movie | Series}
                      type={item.type}
                      formatRuntime={formatRuntime}
                      t={t}
                      ActionButton={ActionButton}
                    />
                  ))}
                  {currentLoading.map(item => (
                    <SkeletonCard key={`loading-${item.type}-${item.id}`} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <Button 
                      onClick={loadMore}
                      disabled={loadingMore}
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-red-500/30"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-3">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('loading')}
                        </span>
                      ) : (
                        pTranslation('loadMore')
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </SignedIn>
    </main>
  );
}
