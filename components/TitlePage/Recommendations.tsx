import { useEffect, useState } from "react";
import Image from "next/image";
import HorizontalCarousel from "@/components/carousel";
import { Link } from "@/i18n/routing";
import WatchlistButton from "../ui/AddToWatchlistButton";
import { Title } from "@/types/title";
import { filterBlockedTitles } from "@/utils/filter";

interface RecommendationsProps {
  header: string;
  titleType: "movie" | "tv";
  titleID: number;
  loadingMessage: string;
}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_ACCESS_TOKEN}`
  }
};

const settings = {
  breakpoints: {
    550: 1,  // Less than 400px -> 1 card
    820: 2,  // Less than 520px -> 2 cards
    1100: 3,  // Less than 640px -> 3 cards
    1200: 4, // Less than 1200px -> 4 cards
    1500: 5, // Less than 1500px -> 5 cards
  },
  defaultImagesPerPage: 6 // Default when width is larger than all breakpoints
};


const Recommendations: React.FC<RecommendationsProps> = ({ titleType, titleID, header, loadingMessage }) => {
  const [recommendations, setRecommendations] = useState([] as Title[]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([] as Title[]);
  const [loading, setLoading] = useState(true);
  const url = `https://api.themoviedb.org/3/${titleType === 'movie' ? "movie" : "tv"}/${titleID}/recommendations?language=en-US&page=1`
  useEffect(() => {
    fetch(url, options)
      .then(response => response.json())
      .then(json => (setRecommendations(json.results)))
      .catch(error => console.error('Error fetching recommendations:', error));
  }, [titleID]);

  useEffect(() => {
    const filterBlocked = async () => {
      const filterd = await filterBlockedTitles(recommendations, titleType === 'movie' ? 'movie' : 'series');
      setFilteredRecommendations(filterd);
      // Use the filtered array length directly instead of state
      setLoading(false);
    };

    if (recommendations.length > 0) {
      filterBlocked();
    }
  }, [recommendations, titleType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{loadingMessage}</p>
      </div>
    );
  }


  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">{header}</h2>
      {
        filteredRecommendations.length > 0 ? (
          <HorizontalCarousel
            navStyle='style3'
            data={filteredRecommendations}
            settings={settings}
            ItemComponent={({ item }) => (
              <div key={item.id} className="overflow-hidden rounded-lg p-4 dark:bg-black-12 bg-gray-95 flex flex-col group">
                <div className="relative w-full h-[300px] overflow-hidden rounded-lg group-hover:scale-105 transition-all">
                  <Link href={`/browse/${titleType === "movie" ? 'movies' : 'tv-shows'}/title/${item.id}`}>
                    <Image src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : `https://placehold.co/500x800.png?text=${item.title ? item.title : item.name || 'No Poster Available'}`}
                      alt={item.name ? item.name : item.title || 'No title available'} width={250} height={300}
                      className="w-full h-full object-cover pointer-events-none " />
                  </Link>
                  {item.id && <WatchlistButton titleId={item.id.toString()} titleType={titleType} style='badge'
                    className="opacity-0 group-hover:opacity-100 transition-all" />}
                </div>
              </div>
            )}
          />
        ) : (
          <p className="text-gray-500">No recommendations available.</p>
        )
      }
    </div>
  )
}

export default Recommendations