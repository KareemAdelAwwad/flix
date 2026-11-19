import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

export interface WatchlistItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt?: Date | null;
}

export interface PaginatedWatchlistResult {
  items: WatchlistItem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const PAGE_SIZE = 12;

export const subscribeToWatchlist = (
  userId: string,
  onUpdate: (items: WatchlistItem[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, 'Watchlists'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((entry) => {
        const d = entry.data();
        return {
          titleId: String(d.titleId),
          titleType: d.titleType as 'movie' | 'tv',
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
        };
      });
      onUpdate(data);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      onError?.(error as Error);
    }
  );
};

export const fetchWatchlist = async (
  userId: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null
): Promise<PaginatedWatchlistResult> => {
  const q = lastDoc
    ? query(
        collection(db, 'Watchlists'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
    : query(
        collection(db, 'Watchlists'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((entry) => {
    const d = entry.data();
    return {
      titleId: String(d.titleId),
      titleType: d.titleType as 'movie' | 'tv',
      createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
    };
  });

  return {
    items,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
};

export const fetchWatchlistIds = async (userId: string): Promise<string[]> => {
  const q = query(collection(db, 'Watchlists'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((entry) => {
    const d = entry.data();
    return `${d.titleType}:${d.titleId}`;
  });
};