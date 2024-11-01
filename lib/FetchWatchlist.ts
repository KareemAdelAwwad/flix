import { db } from './firebase';

interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
}

export const fetchWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  const watchlistRef = db.collection('Watchlists').where('userId', '==', userId);
  const snapshot = await watchlistRef.get();
  const data = snapshot.docs.map(doc => {
    const docData = doc.data();
    return {
      titleId: docData.titleId,
      titleType: docData.titleType,
      // Map other properties if needed
    } as WatchlistItem;
  });
  return data;
};
