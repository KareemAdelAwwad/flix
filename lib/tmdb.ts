import { Movie, Series } from '@/types/title';
import { Details, Images as PersonImages, MovieCredits, TVCredits } from '@/types/person';
import { MovieCertification, SeriesCertification } from '@/types/titleCertification';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getTmdbAuth(): { headers: Record<string, string>; apiKey?: string } {
  const token =
    process.env.TMDB_API_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (token) {
    return {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    headers: { accept: 'application/json' },
    apiKey,
  };
}

export async function tmdbFetch<T>(
  path: string,
  revalidateSeconds: number = 3600
): Promise<T> {
  const { headers, apiKey } = getTmdbAuth();
  const separator = path.includes('?') ? '&' : '?';
  const url =
    !headers.Authorization && apiKey
      ? `${TMDB_BASE_URL}${path}${separator}api_key=${apiKey}`
      : `${TMDB_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: 'GET',
    headers,
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status}) for ${path}`);
  }

  return res.json() as Promise<T>;
}

export interface MovieBrowseData {
  popular: Movie[];
  topRated: Movie[];
  trending: Movie[];
  action: Movie[];
}

export interface SeriesBrowseData {
  popular: Series[];
  topRated: Series[];
  trending: Series[];
  airingToday: Series[];
}

export async function getHomeMovies(locale: string): Promise<{
  trending: Movie[];
  popular: Movie[];
}> {
  const [trendingP1, trendingP2, popularRes] = await Promise.all([
    tmdbFetch<{ results: Movie[] }>('/trending/movie/week?language=en-US&page=1', 3600),
    tmdbFetch<{ results: Movie[] }>('/trending/movie/week?language=en-US&page=2', 3600),
    tmdbFetch<{ results: Movie[] }>(`/movie/popular?language=${locale}&page=1`, 3600),
  ]);

  return {
    trending: [...(trendingP1.results || []), ...(trendingP2.results || [])].slice(0, 30),
    popular: (popularRes.results || []).slice(0, 20),
  };
}

export async function getBrowseMovies(locale: string): Promise<MovieBrowseData> {
  const [popularRes, topRatedRes, trendingRes, actionRes] = await Promise.all([
    tmdbFetch<{ results: Movie[] }>(`/movie/popular?language=${locale}&page=1`, 3600),
    tmdbFetch<{ results: Movie[] }>(`/movie/top_rated?language=${locale}&page=1`, 3600),
    tmdbFetch<{ results: Movie[] }>(`/trending/movie/week?language=${locale}`, 3600),
    tmdbFetch<{ results: Movie[] }>(`/discover/movie?language=${locale}&with_genres=28&page=1`, 3600),
  ]);

  return {
    popular: popularRes.results || [],
    topRated: (topRatedRes.results || []).slice(0, 14),
    trending: trendingRes.results || [],
    action: actionRes.results || [],
  };
}

export async function getBrowseShows(locale: string): Promise<SeriesBrowseData> {
  const [popularRes, topRatedRes, trendingRes, airingRes] = await Promise.all([
    tmdbFetch<{ results: Series[] }>(`/tv/popular?language=${locale}&page=1`, 3600),
    tmdbFetch<{ results: Series[] }>(`/tv/top_rated?language=${locale}&page=1`, 3600),
    tmdbFetch<{ results: Series[] }>(`/trending/tv/week?language=${locale}`, 3600),
    tmdbFetch<{ results: Series[] }>(`/tv/airing_today?language=${locale}&page=1`, 3600),
  ]);

  return {
    popular: popularRes.results || [],
    topRated: (topRatedRes.results || []).slice(0, 14),
    trending: trendingRes.results || [],
    airingToday: airingRes.results || [],
  };
}

export interface MovieDetailBundle extends Movie {
  images?: {
    backdrops: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
    posters: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
    logos: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
  };
  credits?: {
    cast: {
      id: number;
      gender: number;
      name: string;
      original_name: string;
      character: string;
      profile_path: string;
      credit_id: string;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
  reviews?: {
    results: {
      author_details: { name: string; username: string; avatar_path: string | null; rating: number | null };
      content: string;
      created_at: string;
      id: string;
    }[];
  };
  videos?: {
    results: { key: string; site: string; type: string; official?: boolean }[];
  };
  keywords?: {
    keywords: { id: number; name: string }[];
  };
  release_dates?: {
    results: MovieCertification['results'];
  };
  recommendations?: {
    results: (Movie & { adult?: boolean })[];
  };
}

export interface SeriesDetailBundle extends Series {
  images?: {
    backdrops: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
    posters: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
    logos: { file_path: string; iso_639_1: string | null; aspect_ratio: number; height: number; width: number }[];
  };
  aggregate_credits?: {
    cast: {
      id: number;
      gender: number;
      name: string;
      original_name: string;
      profile_path: string;
      credit_id: string;
      order: number;
      roles: { character: string; episode_count: number }[];
    }[];
  };
  reviews?: {
    results: {
      author_details: { name: string; username: string; avatar_path: string | null; rating: number | null };
      content: string;
      created_at: string;
      id: string;
    }[];
  };
  videos?: {
    results: { key: string; site: string; type: string; official?: boolean }[];
  };
  keywords?: {
    results: { id: number; name: string }[];
  };
  content_ratings?: {
    results: SeriesCertification['results'];
  };
  external_ids?: {
    imdb_id: string | null;
  };
  recommendations?: {
    results: (Series & { adult?: boolean })[];
  };
}

export async function getMovieDetailBundle(id: string, locale: string): Promise<MovieDetailBundle> {
  return tmdbFetch<MovieDetailBundle>(
    `/movie/${id}?language=${locale}&append_to_response=images,credits,reviews,videos,keywords,release_dates,recommendations&include_image_language=ar,en,null`,
    3600
  );
}

export async function getSeriesDetailBundle(id: string, locale: string): Promise<SeriesDetailBundle> {
  return tmdbFetch<SeriesDetailBundle>(
    `/tv/${id}?language=${locale}&append_to_response=images,aggregate_credits,reviews,videos,keywords,content_ratings,recommendations,external_ids&include_image_language=ar,en,null`,
    3600
  );
}

export interface PersonDetailBundle extends Details {
  images?: PersonImages;
  movie_credits?: { cast: MovieCredits[] };
  tv_credits?: { cast: TVCredits[] };
}

export async function getPersonDetailBundle(id: string): Promise<PersonDetailBundle> {
  return tmdbFetch<PersonDetailBundle>(
    `/person/${id}?append_to_response=images,movie_credits,tv_credits`,
    3600
  );
}

export function extractYoutubeTrailerKey(
  videos?: { results?: { key: string; site: string; type: string; official?: boolean }[] }
): string | null {
  const results = videos?.results;
  if (!results?.length) return null;

  const youtubeVideos = results.filter((v) => v.site === 'YouTube' && v.key);
  const officialTrailer = youtubeVideos.find(
    (v) => v.type === 'Trailer' && v.official
  );
  const anyTrailer = youtubeVideos.find((v) => v.type === 'Trailer');
  const teaser = youtubeVideos.find((v) => v.type === 'Teaser');

  return (officialTrailer || anyTrailer || teaser || youtubeVideos[0])?.key ?? null;
}
