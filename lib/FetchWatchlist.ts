import { db } from './firebase';
import firebase from 'firebase/compat/app';

interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt?: Date;
}

interface PaginatedResult {
  items: WatchlistItem[];
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  hasMore: boolean;
}

const PAGE_SIZE = 12;

export const subscribeToWatchlist = (
  userId: string,
  onUpdate: (items: WatchlistItem[]) => void,
  onError?: (error: Error) => void
) => {
  const watchlistRef = db.collection('Watchlists')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(PAGE_SIZE);

  // Return the unsubscribe function
  return watchlistRef.onSnapshot(
    (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          titleId: data.titleId,
          titleType: data.titleType,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
        };
      });
      onUpdate(data);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  );
};

// Paginated fetch for initial load
export const fetchWatchlist = async (userId: string, lastDoc?: firebase.firestore.QueryDocumentSnapshot | null): Promise<PaginatedResult> => {
  let query = db.collection('Watchlists')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(PAGE_SIZE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const items = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      titleId: data.titleId,
      titleType: data.titleType,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  });

  return {
    items,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
};

// Fetch all for cases where we need the total count
export const fetchWatchlistAll = async (userId: string): Promise<WatchlistItem[]> => {
  const watchlistRef = db.collection('Watchlists')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');
  const snapshot = await watchlistRef.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      titleId: data.titleId,
      titleType: data.titleType,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  });
};