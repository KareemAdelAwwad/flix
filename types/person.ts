export interface Details {
  id: number
  name: string
  gender: 0 | 1 | 2 | 3
  biography: string
  birthday: string
  deathday: string | null
  place_of_birth: string
  profile_path: string | null
}

export interface Images {
  profiles: {
    aspect_ratio: number
    file_path: string
    height: number
    width: number
  }[]
}

export interface MovieCredits {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string | number | Date
}

export interface TVCredits {
  id: number
  name: string
  poster_path: string | null
  vote_average: number
  first_air_date: string | number | Date
}