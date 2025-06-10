export interface MovieCertification {
  "id": number;
  "results": {
    "iso_3166_1": string,
    "release_dates": {
      "certification": string | null,
    }[]
  }[]
}


export interface SeriesCertification {
  "results": {
    "iso_3166_1": string,
    "rating": number
  }[]
}