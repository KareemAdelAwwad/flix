import { db } from './firebase';
import { WatchlistItem } from '@/types/watchlist';

export const addToWatchlist = async (userId: string, titleId: string, titleType: string) => {
  if (!userId) throw new Error("User not authenticated");

  // Check if the movie already exists in the user's watchlist
  const watchlistRef = db.collection('Watchlists');
  const existingEntry = await watchlistRef
    .where('userId', '==', userId)
    .where('titleId', '==', titleId)
    .where('titleType', '==', titleType)
    .get();

  if (!existingEntry.empty) {
    // If the movie exists, delete it from the watchlist
    const batch = db.batch();
    existingEntry.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Movie removed from watchlist");
  } else {
    // If the movie does not exist, add it to the watchlist
    await watchlistRef.add({
      userId: userId,
      titleId: titleId,
      titleType: titleType,
    });
    console.log("Movie added to watchlist");
  }
};