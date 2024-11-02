import { useState, useEffect, use } from 'react'
import { Link } from '@/i18n/routing';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from '@/components/ui/input'
import { IoClose, IoSearch } from "react-icons/io5";
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface SearchResults {
  media_type: 'movie' | 'tv' | 'person';
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  profile_path?: string;
  gender?: number;
  known_for_department?: string;
}

const Search = ({ isMobile }: { isMobile: boolean }) => {
  const locale = useLocale();
  const t = useTranslations('Header');
  const [searchValue, setSearchValue] = useState('');
  const [activateSearch, setActivateSearch] = useState(false);
  const [titleType, setTitleType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const url = `https://api.themoviedb.org/3/search/multi?query=${searchValue}&include_adult=false&language=${locale}&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
    }
  };
  // Animation with GSAP
  useGSAP(() => {
    if (activateSearch === true) {
      gsap.to('#search', { duration: 0.5, width: '90%', opacity: 1, display: 'block' });
    } else {
      gsap.to('#search', { duration: 0.8, width: '0%', opacity: 0, display: 'none' });
    }
  }
    , [activateSearch]);

  useGSAP(() => {
    if (searchResults.length > 0) {
      gsap.to('#search-results-container', { duration: 0.5, opacity: 1, height: 'auto' });
    } else {
      gsap.to('#search-results-container', { duration: 0.5, opacity: 0, height: 0 });
    }
  }, [searchResults]);

  // Fetching data from TMDB API
  useEffect(() => {
    if (searchValue.length > 0) {
      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          if (data.results.length > 0) {
            setSearchResults(data.results.slice(0, 5));
          }
        })
        .catch(error => console.error('Error:', error));
    }
    if (searchValue.length === 0) {
      setSearchResults([]);
    }
  }, [searchValue])

  // Search Icon Click Handler
  const clickHandler = () => {
    setActivateSearch(!activateSearch);
    setSearchValue('');
    setSearchResults([]);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivateSearch(false);
        setSearchValue('');
      } else if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setActivateSearch(true);
        setTimeout(() => {
          const searchInput = document.getElementById('search') as HTMLInputElement;
          searchInput?.focus();
        }, 300); // Adjust the timeout duration if necessary
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Title Card Component
  interface TitleCardProps {
    id: number;
    titleType: 'movie' | 'tv';
    title: string;
    overview: string;
    poster_path: string;
  }

  const TitleCard = ({ title, overview, poster_path, id, titleType }: TitleCardProps) => {
    return (
      <Link href={`/browse/${titleType === 'movie' ? 'movies' : 'tv-shows'}/title/${id}`}
        onClick={() => clickHandler()} className='w-full'>
        <div className='flex items-center gap-2 borders p-4 rounded-lg
      hover:scale-105 dark:bg-black-15 bg-gray-65 dark:hover:bg-black-10 transition-all cursor-pointer'>
          <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            width={80} height={120}
            alt={title} className='w-20 h-24 rounded-lg' />
          <div className='flex flex-col justify-between gap-2 h-full w-full overflow-hidden'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold truncate w-[70%]'>{title}</h3>
              {
                !isMobile &&
                <span className='rounded-full bg-red-50 hover:bg-red-60 p-1 px-2.5 text-sm'>
                  {titleType === 'movie' ? 'Movie' : 'Series'}
                </span>
              }
            </div>
            {
              !isMobile && <p className='text-sm dark:text-gray-75 text-black-30'>{overview.length > 180 ? overview.substring(0, 180) + '...' : overview}</p>
            }
          </div>
        </div>
      </Link>
    )
  }

  // Person Component
  interface PersonProps {
    id: number;
    name: string;
    profile_path: string;
    gender: number;
    known_for_department: string;
  }

  const PersonCard = ({ name, profile_path, id, gender, known_for_department }: PersonProps) => {
    return (
      <Link href={`/browse/people/person/${id}`} onClick={() => clickHandler()}
        className='w-full'>
        <div className='flex items-center gap-2 borders p-4 rounded-lg
      hover:scale-105 dark:bg-black-15 bg-gray-65 dark:hover:bg-black-10 transition-all cursor-pointer'>
          <div className='w-20 h-20 rounded-lg overflow-hidden'>
            <Image src={profile_path}
              width={60} height={120}
              alt={name} className='w-full h-full object-cover' />
          </div>
          <div className='flex flex-col justify-between h-full w-full'>
            <div className='flex justify-between items-center w-full'>
              <h3 className='text-lg font-semibold truncate w-[70%]'>{name}</h3>
              {
                !isMobile &&
                <span className='rounded-full bg-red-50 hover:bg-red-60 p-1 px-2.5 text-sm'>
                  {known_for_department}
                </span>
              }
            </div>
          </div>
        </div>
      </Link>
    )
  }


  return (
    <>
      <span className={`p-3 
      ${isMobile ? 'rounded-xl' : 'rounded-full'} bg-black-20 hover:hover:bg-black-30 transition-all duration-300
        ${isMobile && 'w-full flex flex-row-reverse'}`}
        onClick={() => isMobile && setActivateSearch(true)}
        >
        {
          (activateSearch === true || searchValue !== "") ?
            <IoClose className={`text-white cursor-pointer `} size={16} onClick={() => clickHandler()} />
            : <IoSearch className={`text-white cursor-pointer`} size={16} onClick={() => clickHandler()} />
        }
        <Input id='search' type='text' placeholder={t('search')} value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`absolute text-black-6 dark:text-white ${locale === 'en' ? 'left-1' : 'right-1'}
          ${isMobile ? (locale === 'en' ? "top-0 left-0" : 'top-0 right-0') : 'top-1'} 
          ${isMobile ? 'rounded-xl' : 'rounded-full'}
          opacity-0 ${(activateSearch === true) && "opacity-100"}`} />
      </span>
      <div id='search-results-container'
        className={`absolute top-16 w-full dark:bg-black-20 bg-gray-50 borders py-4 px-6 rounded-xl opacity-0 ${searchResults.length > 0 && "opacity-100"}`}>
        <div className='flex flex-col gap-4'>
          {searchResults.map((result: SearchResults, index) => (
            <div key={index} className='flex gap-2'>
              {result.media_type === 'movie' &&
                <TitleCard
                  titleType='movie'
                  id={result.id}
                  title={result.title ? result.title : "No Title"}
                  overview={result.overview}
                  poster_path={result.poster_path}
                />}
              {result.media_type === 'tv' &&
                <TitleCard
                  titleType='tv'
                  id={result.id}
                  title={result.name ? result.name : "No Title"}
                  overview={result.overview}
                  poster_path={result.poster_path}
                />}
              {result.media_type === 'person' &&
                <PersonCard
                  id={result.id}
                  name={result.name ? result.name : "No Name"}
                  profile_path={result.profile_path ? ('https://image.tmdb.org/t/p/w500' + result.profile_path) :
                    (result.gender === 0 ? 'https://mighty.tools/mockmind-api/content/abstract/10.jpg'
                      : 'https://mighty.tools/mockmind-api/content/abstract/36.jpg'
                    )}
                  known_for_department={result.known_for_department ? result.known_for_department : "No Department"}
                  gender={result.gender ? result.gender : 1}
                />}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Search
