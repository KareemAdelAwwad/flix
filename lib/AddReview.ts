import { db } from './firebase';

// Function to update an existing review
export const updateReview = async (
  docId: string,
  content: string,
  rating: number
): Promise<void> => {
  const reviewsRef = db.collection('Reviews');
  await reviewsRef.doc(docId).update({
    lastEditDate: new Date(),
    content: content,
    rating: rating,
  });
};

// Function to add a new review
export const addReview = async (
  userId: string,
  firstName: string,
  avatarUrl: string | null,
  titleId: string,
  titleType: 'movie' | 'tv',
  content: string,
  rating: number
): Promise<void> => {
  if (!userId) throw new Error("User not authenticated");

  const reviewsRef = db.collection('Reviews');
  const existingEntry = await reviewsRef
    .where('userId', '==', userId)
    .where('titleId', '==', titleId)
    .where('titleType', '==', titleType)
    .get();

  if (!existingEntry.empty) {
    // If the review exists, update it
    const docId = existingEntry.docs[0].id;
    await updateReview(docId, content, rating);
  } else {
    // If the review does not exist, add a new one
    await reviewsRef.add({
      userId: userId,
      firstName: firstName,
      avatarUrl: avatarUrl,
      titleId: titleId,
      titleType: titleType,
      content: content,
      rating: rating,
      lastEditDate: new Date(),
    });
  }
};