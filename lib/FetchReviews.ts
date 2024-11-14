import { db } from './firebase';
import { FlixUsersReviews as ReviewsItem } from '@/types/title';

export const subscribeToReviews = (
  titleId: string,
  onUpdate: (items: ReviewsItem[]) => void
) => {
  const ReviewsRef = db.collection('Reviews')
    .where('titleId', '==', titleId)
    .where('content', '>', '');

  // Return the unsubscribe function
  return ReviewsRef.onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
      userId: doc.data().userId,
      firstName: doc.data().firstName,
      titleId: doc.data().titleId,
      titleType: doc.data().titleType,
      avatarUrl: doc.data().avatarUrl,
      content: doc.data().content,
      rating: doc.data().rating,
      lastEditDate: doc.data().lastEditDate.toDate(),
    })).sort((a, b) => b.lastEditDate - a.lastEditDate); // Sort by lastEditDate
    onUpdate(data);
  });
};

// Fetch all reviews for a specific titleId
export const fetchReviews = async (titleId: string): Promise<ReviewsItem[]> => {
  const ReviewsRef = db.collection('Reviews').where('titleId', '==', titleId);
  const snapshot = await ReviewsRef.get();
  const data = snapshot.docs.map(doc => ({
    userId: doc.data().userId,
    firstName: doc.data().firstName,
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
    avatarUrl: doc.data().avatarUrl,
    content: doc.data().content,
    rating: doc.data().rating,
    lastEditDate: doc.data().lastEditDate.toDate(),
  })).sort((a, b) => b.lastEditDate - a.lastEditDate); // Sort by lastEditDate
  return data;
};

// Fetch a specific review by titleId and userId
export const fetchUserReview = async (titleId: string, userId: string): Promise<ReviewsItem | null> => {
  const ReviewsRef = db.collection('Reviews')
    .where('titleId', '==', titleId)
    .where('userId', '==', userId)
    .where('content', '>', '');
  const snapshot = await ReviewsRef.get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data: ReviewsItem = {
    docId: doc.id,
    userId: doc.data().userId,
    firstName: doc.data().firstName,
    titleId: doc.data().titleId,
    titleType: doc.data().titleType,
    avatarUrl: doc.data().avatarUrl,
    content: doc.data().content,
    rating: doc.data().rating,
    lastEditDate: doc.data().lastEditDate.toDate(),
  };
  return data;
};