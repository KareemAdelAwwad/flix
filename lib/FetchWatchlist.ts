import { db } from './firebase';

interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt?: Date;
}

export const subscribeToWatchlist = (
  userId: string,
  onUpdate: (items: WatchlistItem[]) => void
) => {
  const watchlistRef = db.collection('Watchlists').where('userId', '==', userId);

  // Return the unsubscribe function
  return watchlistRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        titleId: data.titleId,
        titleType: data.titleType,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
      };
    }).sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt - a.createdAt;
    });
    onUpdate(data);
  });
};

// Keep existing fetchWatchlist for initial load
export const fetchWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  const watchlistRef = db.collection('Watchlists').where('userId', '==', userId);
  const snapshot = await watchlistRef.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      titleId: data.titleId,
      titleType: data.titleType,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  }).sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return b.createdAt - a.createdAt;
  });
};