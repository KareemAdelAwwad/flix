import HomeContent from '@/components/Home';
import { getHomeMovies } from '@/lib/tmdb';

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let trendingMovies = [] as Awaited<ReturnType<typeof getHomeMovies>>['trending'];
  let popularMovies = [] as Awaited<ReturnType<typeof getHomeMovies>>['popular'];

  try {
    const data = await getHomeMovies(locale);
    trendingMovies = data.trending;
    popularMovies = data.popular;
  } catch (error) {
    console.error('Failed to load home movies:', error);
  }

  return (
    <section>
      <HomeContent trendingMovies={trendingMovies} popularMovies={popularMovies} />
    </section>
  );
}
