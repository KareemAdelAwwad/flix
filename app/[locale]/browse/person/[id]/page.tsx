'use client';
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Details, Images, MovieCredits, TVCredits } from "@/types/person";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CompletedButton from "@/components/ui/AddToCompletedButton";
import { Link } from "@/i18n/routing";
import WatchlistButton from "@/components/ui/AddToWatchlistButton";

const LoadingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-4 md:col-span-4">
      <div className="md:col-span-1 animate-pulse">
        {/* Name skeleton */}
        <div className="h-96 w-3/4 bg-gray-200 rounded mb-4" />
      </div>
      {/* Images grid skeleton */}
      <div className="md:col-span-3">
        {/* Birthday and birth place skeletons */}
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />

        {/* Biography skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-1/4 bg-gray-200 rounded my-4" />
        <div className="flex flex-row justify-start flex-wrap gap-4 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="relative w-[100px] h-[150px] bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Movie Credits skeleton */}
      <div className="w-full animate-pulse mt-10 col-span-4">
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-4" />
        <div className="flex md:flex-row justify-center flex-wrap gap-4 w-full">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="relative w-[200px] h-[300px] bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

    </div>
  );
};

export default function page({ params }: { params: { id: number } }) {
  const [details, setDetails] = useState<Details>();
  const [images, setImages] = useState<Images>();
  const [movieCredits, setMovieCredits] = useState<MovieCredits[]>();
  const [tvCredits, setTVCredits] = useState<TVCredits[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const locale = useLocale();
  const t = useTranslations('MoviesShows');

  const DetailsUrl = `https://api.themoviedb.org/3/person/${params.id}?language=${locale}`;
  const ImagesUrl = `https://api.themoviedb.org/3/person/${params.id}/images`;
  const MovieCreditsUrl = `https://api.themoviedb.org/3/person/${params.id}/movie_credits?language=${locale}`;
  const TVCreditsUrl = `https://api.themoviedb.org/3/person/${params.id}/tv_credits?language=${locale}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`,
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsRes, imagesRes, movieCreditsRes, tvCreditsRes] = await Promise.all([
          fetch(DetailsUrl, options),
          fetch(ImagesUrl, options),
          fetch(MovieCreditsUrl, options),
          fetch(TVCreditsUrl, options)
        ]);

        const [detailsData, imagesData, movieCreditsData, tvCreditsData] = await Promise.all([
          detailsRes.json(),
          imagesRes.json(),
          movieCreditsRes.json(),
          tvCreditsRes.json()
        ]);

        setDetails(detailsData);
        setImages(imagesData);
        setMovieCredits(movieCreditsData.cast.sort((a: any, b: any) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()));
        setTVCredits(tvCreditsData.cast.sort((a: any, b: any) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()));
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [DetailsUrl, ImagesUrl, MovieCreditsUrl, TVCreditsUrl, options]);

  if (loading) return <div className="container"><LoadingSkeleton /></div>;
  if (error) return <div className="container">{error}</div>;
  if (!details) return <div className="container">No person found</div>;

  const containerClasses = 'relative flex flex-row justify-center flex-wrap gap-4 w-full borders rounded-lg p-4 pt-12 my-20';
  return (
    <main className="container mx-auto px-4 py-8">
      <title>{details.name}</title>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 borders h-fit rounded-lg overflow-hidden">
          {details.profile_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${details.profile_path}`}
              alt={details.name}
              width={500}
              height={750}
            />
          )}
        </div>

        <div className="md:col-span-3 flex flex-col justify-between h-full">
          <h1 className="text-6xl mb-4 header">{details.name}</h1>
          <div>
            {details.birthday && (
              <p className="mb-2">Born: {new Date(details.birthday).toLocaleDateString()}</p>
            )}
            {details.place_of_birth && (
              <p className="mb-4">Place of Birth: {details.place_of_birth}</p>
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-2">Biography</h2>
          <p className="mb-8">{details.biography}</p>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Images</h2>
            <div className="flex flex-row justify-start flex-wrap gap-4 w-full">
              {images?.profiles.slice(0, 7).map((image) => (
                <div key={image.file_path} className="relative image-card group">
                  <div className="aspect-w-2 aspect-h-3">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${image.file_path}`}
                      alt={details.name}
                      width={200}
                      height={300}
                      className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg borders"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <section className="w-full">
        {/* Movie Credits Section */}
        <div className={containerClasses}>
          <span className={`text-lg font-semibold px-6 py-2 bg-red-45 rounded-lg text-white
            absolute top-0 translate-y-[-50%] 
            ${locale === 'ar' ? 'right-0 -translate-x-[50%]' : 'left-0 translate-x-[50%]'}`}>
            Movies
          </span>
          <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
            {movieCredits?.map((movie) => (
              <div className="relative movie-card group max-w-8 mb-100" key={movie.id}>
                <div className="aspect-w-2 aspect-h-3">
                  <CompletedButton
                    titleId={movie.id.toString()}
                    titleType="movie"
                    style="badge"
                    className="text-white opacity-0 group-hover:opacity-100"
                  />
                  <WatchlistButton
                    titleId={movie.id.toString()}
                    titleType="movie"
                    style="badge"
                    className="text-white !left-[calc(22%)] opacity-0 group-hover:opacity-100"
                  />
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="movie-card-overlay text-center">
                  <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                  <Link href={`/browse/movies/title/${movie.id}`}>
                    <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                      {t('watchMovie')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TV Credits Section */}
        <div className={containerClasses}>
          <span className={`text-lg font-semibold px-6 py-2 bg-red-45 rounded-lg text-white
            absolute top-0 translate-y-[-50%] 
            ${locale === 'ar' ? 'right-0 -translate-x-[50%]' : 'left-0 translate-x-[50%]'}`}>
            TV Shows
          </span>
          <div className="flex flex-row justify-center flex-wrap gap-4 w-full">
            {tvCredits?.map((show) => (
              <div className="relative movie-card group max-w-8 mb-100" key={show.id}>
                <div className="aspect-w-2 aspect-h-3">
                  <CompletedButton
                    titleId={show.id.toString()}
                    titleType="tv"
                    style="badge"
                    className="text-white opacity-0 group-hover:opacity-100"
                  />
                  <WatchlistButton
                    titleId={show.id.toString()}
                    titleType="tv"
                    style="badge"
                    className="text-white !left-[calc(22%)] opacity-0 group-hover:opacity-100"
                  />
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    width={200}
                    height={300}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="movie-card-overlay text-center">
                  <h2 className="text-xl font-bold text-white">{show.name}</h2>
                  <Link href={`/browse/tv-shows/title/${show.id}`}>
                    <Button className="mt-4 bg-red-50 text-white hover:bg-red-60">
                      {t('watchMovie')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

}