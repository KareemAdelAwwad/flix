'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { IoClose, IoSearch } from 'react-icons/io5';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { tmdbImage } from '@/utils/tmdbImage';

interface SearchResults {
  media_type: 'movie' | 'tv' | 'person';
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  gender?: number;
  known_for_department?: string;
}

interface SearchProps {
  isMobile: boolean;
  enableGlobalShortcut?: boolean;
}

const Search = ({ isMobile, enableGlobalShortcut = !isMobile }: SearchProps) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Header');
  const [searchValue, setSearchValue] = useState('');
  const [activateSearch, setActivateSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = useCallback(() => {
    setActivateSearch(false);
    setSearchValue('');
    setSearchResults([]);
  }, []);

  // Debounced search with AbortController
  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(trimmed)}&locale=${encodeURIComponent(locale)}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Search error:', error);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchValue, locale]);

  useEffect(() => {
    if (!enableGlobalShortcut) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActivateSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableGlobalShortcut, closeSearch]);

  useEffect(() => {
    if (activateSearch && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activateSearch]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchResults.length > 0) {
      const firstResult = searchResults[0];
      closeSearch();
      if (firstResult.media_type === 'movie' || firstResult.media_type === 'tv') {
        router.push(
          `/browse/${firstResult.media_type === 'movie' ? 'movies' : 'tv-shows'}/title/${firstResult.id}`
        );
      } else if (firstResult.media_type === 'person') {
        router.push(`/browse/person/${firstResult.id}`);
      }
    } else if (event.key === 'Escape') {
      closeSearch();
    }
  };

  const toggleSearch = () => {
    if (activateSearch) {
      closeSearch();
    } else {
      setActivateSearch(true);
    }
  };

  return (
    <>
      <span
        className={`p-3 ${
          isMobile ? 'rounded-xl w-full flex flex-row-reverse' : 'rounded-full'
        } dark:bg-black-20 bg-white borders dark:hover:bg-black-30 transition-all duration-300`}
        onClick={() => isMobile && !activateSearch && setActivateSearch(true)}
      >
        {activateSearch || searchValue !== '' ? (
          <IoClose
            className="dark:text-white text-black-8 cursor-pointer relative z-10"
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              closeSearch();
            }}
          />
        ) : (
          <IoSearch
            className="dark:text-white text-black-8 cursor-pointer relative z-10"
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              toggleSearch();
            }}
          />
        )}

        <Input
          ref={inputRef}
          type="text"
          placeholder={t('search')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className={`absolute text-black-6 dark:text-white transition-all duration-300 ${
            locale === 'en' ? 'left-1' : 'right-1'
          } ${
            isMobile
              ? locale === 'en'
                ? 'top-[1px] left-0'
                : 'top-[1px] right-0'
              : 'top-[50%] -translate-y-1/2'
          } ${isMobile ? 'rounded-xl' : 'rounded-full'} ${
            activateSearch
              ? 'w-[90%] opacity-100 pointer-events-auto'
              : 'w-0 opacity-0 pointer-events-none'
          }`}
        />
      </span>

      {searchResults.length > 0 && activateSearch && (
        <div className="absolute top-16 left-0 right-0 w-full dark:bg-black-20 bg-gray-50 borders py-4 px-6 rounded-xl z-50 transition-opacity duration-200">
          <div className="flex flex-col gap-4">
            {searchResults.map((result) => (
              <div key={`${result.media_type}-${result.id}`} className="flex gap-2">
                {(result.media_type === 'movie' || result.media_type === 'tv') && (
                  <Link
                    href={`/browse/${result.media_type === 'movie' ? 'movies' : 'tv-shows'}/title/${result.id}`}
                    onClick={closeSearch}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 borders p-4 rounded-lg hover:scale-[1.02] dark:bg-black-15 bg-gray-95 dark:hover:bg-black-10 transition-all cursor-pointer">
                      <Image
                        src={tmdbImage(result.poster_path, 'w185')}
                        width={80}
                        height={120}
                        alt={result.title || result.name || 'Title'}
                        className="w-20 h-24 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex flex-col justify-between gap-2 h-full w-full overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold truncate w-[70%] dark:text-white text-black-6">
                            {result.title || result.name || 'No Title'}
                          </h3>
                          {!isMobile && (
                            <span className="rounded-full bg-red-50 hover:bg-red-60 p-1 px-2.5 text-sm text-white">
                              {result.media_type === 'movie' ? 'Movie' : 'Series'}
                            </span>
                          )}
                        </div>
                        {!isMobile && result.overview && (
                          <p className="text-sm dark:text-gray-75 text-black-30">
                            {result.overview.length > 180
                              ? result.overview.substring(0, 180) + '...'
                              : result.overview}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                {result.media_type === 'person' && (
                  <Link
                    href={`/browse/person/${result.id}`}
                    onClick={closeSearch}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 borders p-4 rounded-lg hover:scale-[1.02] dark:bg-black-15 bg-gray-95 dark:hover:bg-black-10 transition-all cursor-pointer">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={tmdbImage(result.profile_path, 'w185', '/images/no-avatar.svg')}
                          width={60}
                          height={120}
                          alt={result.name || 'Person'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between h-full w-full">
                        <div className="flex justify-between items-center w-full">
                          <h3 className="text-lg font-semibold truncate w-[70%] dark:text-white text-black-6">
                            {result.name || 'No Name'}
                          </h3>
                          {!isMobile && (
                            <span className="rounded-full bg-red-50 hover:bg-red-60 p-1 px-2.5 text-sm text-white">
                              {result.known_for_department || 'Person'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
