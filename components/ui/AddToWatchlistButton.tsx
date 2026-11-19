'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useUserListsStore } from '@/store';
import { Button } from './button';
import ReadyTooltip from './ready-tooltip';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import { useLocale } from 'next-intl';

interface WatchlistButtonProps {
  titleId: string | undefined;
  titleType: 'movie' | 'tv';
  style: 'icon' | 'text' | 'badge';
  className?: string;
}

const strings = {
  en: {
    add: 'Add to Watchlist',
    remove: 'Remove from Watchlist',
  },
  ar: {
    add: 'أضف إلى قائمة المشاهدة',
    remove: 'إزالة من قائمة المشاهدة',
  },
};

const WatchlistButton: React.FC<WatchlistButtonProps> = React.memo(
  ({ titleId, titleType, style, className }) => {
    const { userId } = useAuth();
    const locale = useLocale();
    const key = titleId ? `${titleType}:${titleId}` : '';

    const isInWatchlist = useUserListsStore((state) =>
      key ? state.watchlistSet.has(key) : false
    );
    const toggleWatchlist = useUserListsStore((state) => state.toggleWatchlist);

    const label = useMemo(() => {
      const lang = locale === 'ar' ? strings.ar : strings.en;
      return isInWatchlist ? lang.remove : lang.add;
    }, [isInWatchlist, locale]);

    const handleAddToWatchlist = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!userId || !titleId) return;
      try {
        await toggleWatchlist(userId, titleId, titleType);
      } catch (error) {
        console.error('Failed to update watchlist:', error);
        alert('Failed to update watchlist');
      }
    };

    if (style === 'icon') {
      return (
        <ReadyTooltip title={label}>
          <Button onClick={handleAddToWatchlist} size="lgIcon" className={className} aria-label={label}>
            {isInWatchlist ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />}
          </Button>
        </ReadyTooltip>
      );
    }

    if (style === 'text') {
      return (
        <Button onClick={handleAddToWatchlist} size="default" className={className}>
          {isInWatchlist ? <IoBookmark size={24} /> : <IoBookmarkOutline size={24} />}
          {label}
        </Button>
      );
    }

    if (style === 'badge') {
      return (
        <Button
          onClick={handleAddToWatchlist}
          size="lgIcon"
          aria-label={label}
          className={`-top-1 left-2 absolute w-8 rounded-none rounded-b z-10 ${className ?? ''}`}
        >
          {isInWatchlist ? (
            <IoBookmark className="dark:text-white text-black-12" size={32} />
          ) : (
            <IoBookmarkOutline className="dark:text-white text-black-12" size={32} />
          )}
        </Button>
      );
    }

    return null;
  }
);

WatchlistButton.displayName = 'WatchlistButton';

export default WatchlistButton;