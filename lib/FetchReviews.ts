import { db } from './firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { FlixUsersReviews as ReviewsItem } from '@/types/title';

export const subscribeToReviews = (
  titleId: string,
  onUpdate: (items: ReviewsItem[]) => void
) => {
  const q = query(
    collection(db, 'Reviews'),
    where('titleId', '==', titleId),
    where('content', '>', '')
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs
      .map((entry) => {
        const d = entry.data();
        return {
          docId: entry.id,
          userId: d.userId,
          firstName: d.firstName,
          titleId: d.titleId,
          titleType: d.titleType,
          avatarUrl: d.avatarUrl,
          content: d.content,
          rating: d.rating,
          lastEditDate: d.lastEditDate?.toDate ? d.lastEditDate.toDate() : new Date(),
        } as ReviewsItem;
      })
      .sort((a, b) => b.lastEditDate.getTime() - a.lastEditDate.getTime());
    onUpdate(data);
  });
};

export const fetchReviews = async (titleId: string): Promise<ReviewsItem[]> => {
  const q = query(collection(db, 'Reviews'), where('titleId', '==', titleId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((entry) => {
      const d = entry.data();
      return {
        docId: entry.id,
        userId: d.userId,
        firstName: d.firstName,
        titleId: d.titleId,
        titleType: d.titleType,
        avatarUrl: d.avatarUrl,
        content: d.content,
        rating: d.rating,
        lastEditDate: d.lastEditDate?.toDate ? d.lastEditDate.toDate() : new Date(),
      } as ReviewsItem;
    })
    .sort((a, b) => b.lastEditDate.getTime() - a.lastEditDate.getTime());
};