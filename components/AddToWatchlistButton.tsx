import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { addToWatchlist } from '@/lib/AddToWatchlist';
import { db } from '@/lib/firebase';
import { Button } from './ui/button';
import ReadyTooltip from './ui/ready-tooltip';
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

interface WatchlistButtonProps {
  titleId: string;
  titleType: "movie" | "tv";
  style: "icon" | "text" | "badge";
  className?: string;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ titleId, titleType, style, className }) => {
  const { userId } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!userId) return;

      const watchlistRef = db.collection('Watchlists');
      const existingEntry = await watchlistRef
        .where('userId', '==', userId)
        .where('titleId', '==', titleId)
        .where('titleType', '==', titleType)
        .get();

      setIsInWatchlist(!existingEntry.empty);
    };

    checkWatchlist();
  }, [userId, titleId, titleType]);

  const handleAddToWatchlist = async () => {
    try {
      if (userId) {
        await addToWatchlist(userId, titleId, titleType);
        setIsInWatchlist(prev => !prev);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
      alert('Failed to update watchlist');
    }
  };

  return (
    style === 'icon' ? (
      <ReadyTooltip
        children={<Button onClick={handleAddToWatchlist} size={'lgIcon'} className={className}>
          {
            isInWatchlist ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />
          }
        </Button>}
        title={isInWatchlist ? "remove" : "add"} />
    ) : style === 'text' ? (
      <Button onClick={handleAddToWatchlist} size={"default"} className={className}>
        {
          isInWatchlist ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />
        }
        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </Button>
    ) : style === 'badge' ? (
      <Button onClick={handleAddToWatchlist} size={"lgIcon"}
      className={`-top-1 left-2 absolute w-8 rounded-none rounded-b ${className}`} >
        {
          isInWatchlist ? <IoBookmark size={32} /> : <IoBookmarkOutline size={32} />
        }
      </Button>
    ) : null
  );
};

export default WatchlistButton;