'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { fetchCompleted, subscribeToCompleted } from '@/lib/FetchCompleted';
import CompletedButton from '@/components/ui/AddToCompletedButton';
import ListPage from '@/components/ListPage';

const Page = () => {
  const pTranslation = useTranslations('Lists');
  const hTranslation = useTranslations('Header');

  return (
    <ListPage
      pageType="watched"
      pageTitle={hTranslation('watched')}
      emptyMessage={pTranslation('emptyWatched')}
      fetchData={fetchCompleted}
      subscribeToData={subscribeToCompleted}
      ActionButton={CompletedButton}
    />
  );
};

export default Page;
