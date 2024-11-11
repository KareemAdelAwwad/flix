import { db } from './firebase';

interface CompletedItem {
  titleId: string;
  titleType: 'movie' | 'tv';
  createdAt: Date;
}

export const subscribeToCompleted = (
  userId: string, 
  onUpdate: (items: CompletedItem[]) => void
) => {
  const completedRef = db.collection('Completed').where('userId', '==', userId);
  
  // Return the unsubscribe function
  return completedRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
      titleId: doc.data().titleId,
      titleType: doc.data().titleType,
      createdAt: doc.data().createdAt.toDate(),
    })).sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt date
    onUpdate(data);
  });
};

// Keep existing FetchCompleted for initial load
export const fetchCompleted = async (userId: string): Promise<CompletedItem[]> => {
  const completedRef = db.collection('Completed').where('userId', '==', userId);
  const snapshot = await completedRef.get();
  const data = snapshot.docs.map(doc => ({
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
    createdAt: doc.data().createdAt.toDate(),
  })).sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt date
  return data;
};