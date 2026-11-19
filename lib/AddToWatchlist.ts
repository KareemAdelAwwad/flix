import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';

export const addToWatchlist = async (
  userId: string,
  titleId: string,
  titleType: 'movie' | 'tv'
): Promise<boolean> => {
  if (!userId) throw new Error('User not authenticated');

  const watchlistRef = collection(db, 'Watchlists');
  const q = query(
    watchlistRef,
    where('userId', '==', userId),
    where('titleId', '==', titleId),
    where('titleType', '==', titleType)
  );
  const existingEntry = await getDocs(q);

  if (!existingEntry.empty) {
    const batch = writeBatch(db);
    existingEntry.forEach((entryDoc) => {
      batch.delete(entryDoc.ref);
    });
    await batch.commit();
    return false;
  }

  await addDoc(watchlistRef, {
    userId,
    titleId,
    titleType,
    createdAt: Timestamp.now(),
  });
  return true;
};