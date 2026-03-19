'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { fetchWatchlist, subscribeToWatchlist } from '@/lib/FetchWatchlist';
import WatchlistButton from '@/components/ui/AddToWatchlistButton';
import ListPage from '@/components/ListPage';

const Page = () => {
  const pTranslation = useTranslations('Lists');
  const hTranslation = useTranslations('Header');

  return (
    <ListPage
      pageType="watchlist"
      pageTitle={hTranslation('watchlist')}
      emptyMessage={pTranslation('emptyWatchlist')}
      fetchData={fetchWatchlist}
      subscribeToData={subscribeToWatchlist}
      ActionButton={WatchlistButton}
    />
  );
};

export default Page;
