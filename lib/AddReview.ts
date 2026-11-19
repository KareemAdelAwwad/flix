import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

export const updateReview = async (
  docId: string,
  content: string,
  rating: number
): Promise<void> => {
  await updateDoc(doc(db, 'Reviews', docId), {
    lastEditDate: Timestamp.now(),
    content,
    rating,
  });
};

export const addReview = async (
  userId: string,
  firstName: string,
  avatarUrl: string | null,
  titleId: string,
  titleType: 'movie' | 'tv',
  content: string,
  rating: number
): Promise<void> => {
  if (!userId) throw new Error('User not authenticated');

  const reviewsRef = collection(db, 'Reviews');
  const q = query(
    reviewsRef,
    where('userId', '==', userId),
    where('titleId', '==', titleId),
    where('titleType', '==', titleType)
  );
  const existingEntry = await getDocs(q);

  if (!existingEntry.empty) {
    const existingDocId = existingEntry.docs[0].id;
    await updateReview(existingDocId, content, rating);
  } else {
    await addDoc(reviewsRef, {
      userId,
      firstName,
      avatarUrl,
      titleId,
      titleType,
      content,
      rating,
      lastEditDate: Timestamp.now(),
    });
  }
};