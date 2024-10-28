/**
 * Series related type definitions
 */

export interface Series {
  id: number;
  name: string;
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  overview: string;
  imdb_id: string | null;
  original_title: string;
  origin_country: string[];
  original_language: string;
  adult: boolean;
  popularity: number;
  poster_path: string;
  backdrop_path: string;
  seasons: Season[];
  genres: Genre[];
  homepage: string | null;
  production_companies: ProductionCompany[];
  networks: Network[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episodes?: Episode[];
}

export interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  runtime: number;
  production_code: string;
  still_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Network {
  name: string;
  id: number;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface SeriesImages {
  id: number;
  backdrops: ImageItem[];
  posters: ImageItem[];
  logos: ImageItem[];
}

export interface ImageItem {
  file_path: string;
  iso_639_1: string;
  aspect_ratio: number;
  height: number;
  width: number;
}

export interface ProviderItem {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface Provider {
  link: string;
  flatrate: ProviderItem[];
}

export interface SeriesCastMember {
  id: number;
  gender: number;
  name: string;
  original_name: string;
  profile_path: string;
  credit_id: string;
  order: number;
  roles: {
    character: string;
    episode_count: number;
  }[];
}
export interface MovieCastMember {
  id: number;
  gender: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string;
  credit_id: string;
  order: number;
}

export type SeriesCast = SeriesCastMember[];
export type MovieCast = MovieCastMember[];

export interface Review {
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
}

export interface CachedSeasonData {
  [key: number]: {
    episodes: Episode[];
  };
}

export interface ImageProps {
  src: 'backdrops' | 'posters' | 'logos';
  height: number;
  width: number;
  className?: string;
  ratio: number;
}

export interface SliderSettings {
  breakpoints: {
    [key: number]: number;
  };
  defaultImagesPerPage: number;
}