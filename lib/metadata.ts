import { Movie } from '@/types/title';
export function generateMetadata(movie: Movie, locale: string) {
  return {
    title: locale === 'ar' ? `شاهد ${movie.title} على فليكس` : `Watch ${movie.title} On Flix`,
    description: movie.overview,
    keywords: movie.genres && movie.genres.map(genre => genre.name),
    openGraph: {
      title: `Watch ${movie.title} On Flix`,
      description: movie.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          width: 1800,
          height: 835,
          alt: movie.title,
          type: "image/png"
        }
      ],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: "website",
    },
  };
}