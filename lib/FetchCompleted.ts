import { db } from './firebase';
import firebase from 'firebase/compat/app';

interface CompletedItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt: Date;
}

interface PaginatedResult {
  items: CompletedItem[];
  lastDoc: firebase.firestore.QueryDocumentSnapshot | null;
  hasMore: boolean;
}

const PAGE_SIZE = 12;

export const subscribeToCompleted = (
  userId: string, 
  onUpdate: (items: CompletedItem[]) => void,
  onError?: (error: Error) => void
) => {
  const completedRef = db.collection('Completed')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(PAGE_SIZE);
  
  // Return the unsubscribe function
  return completedRef.onSnapshot(
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        titleId: doc.data().titleId,
        titleType: doc.data().titleType,
        createdAt: doc.data().createdAt.toDate(),
      }));
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
export const fetchCompleted = async (userId: string, lastDoc?: firebase.firestore.QueryDocumentSnapshot | null): Promise<PaginatedResult> => {
  let query = db.collection('Completed')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(PAGE_SIZE);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const items = snapshot.docs.map(doc => ({
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
    createdAt: doc.data().createdAt.toDate(),
  }));

  return {
    items,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === PAGE_SIZE,
  };
};

// Fetch all for cases where we need the total count
export const fetchCompletedAll = async (userId: string): Promise<CompletedItem[]> => {
  const completedRef = db.collection('Completed')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc');
  const snapshot = await completedRef.get();
  return snapshot.docs.map(doc => ({
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
    createdAt: doc.data().createdAt.toDate(),
  }));
};