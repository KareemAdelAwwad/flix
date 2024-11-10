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
      createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to Date
    })).sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt date
    console.log('subscribeToCompleted data:', data); // Add this line
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
    createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to Date
  })).sort((a, b) => b.createdAt - a.createdAt); // Sort by createdAt date
  console.log('fetchCompleted data:', data); // Add this line
  return data;
};