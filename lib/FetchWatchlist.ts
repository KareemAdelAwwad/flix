import { db } from './firebase';

interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
}

export const subscribeToWatchlist = (
  userId: string, 
  onUpdate: (items: WatchlistItem[]) => void
) => {
  const watchlistRef = db.collection('Watchlists').where('userId', '==', userId);
  
  // Return the unsubscribe function
  return watchlistRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
      titleId: doc.data().titleId,
      titleType: doc.data().titleType,
    }));
    onUpdate(data);
  });
};

// Keep existing fetchWatchlist for initial load
export const fetchWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  const watchlistRef = db.collection('Watchlists').where('userId', '==', userId);
  const snapshot = await watchlistRef.get();
  return snapshot.docs.map(doc => ({
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
  }));
};