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

export interface CompletedItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt: Date | null;
}

export interface PaginatedCompletedResult {
  items: CompletedItem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const PAGE_SIZE = 12;

export const subscribeToCompleted = (
  userId: string,
  onUpdate: (items: CompletedItem[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, 'Completed'),
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

export const fetchCompleted = async (
  userId: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null
): Promise<PaginatedCompletedResult> => {
  const baseQuery = query(
    collection(db, 'Completed'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE)
  );

  const q = lastDoc
    ? query(
        collection(db, 'Completed'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
    : baseQuery;

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

export const fetchCompletedIds = async (userId: string): Promise<string[]> => {
  const q = query(collection(db, 'Completed'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((entry) => {
    const d = entry.data();
    return `${d.titleType}:${d.titleId}`;
  });
};