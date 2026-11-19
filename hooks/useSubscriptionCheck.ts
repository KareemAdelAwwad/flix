import { useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSubscriptionStore, useUserListsStore } from '@/store';

export const useSubscriptionCheck = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { userId } = useAuth();
  const checkedEmailRef = useRef<string | null>(null);

  const setSubscriptionStatus = useSubscriptionStore((s) => s.setSubscriptionStatus);
  const setLoading = useSubscriptionStore((s) => s.setLoading);
  const setPrice = useSubscriptionStore((s) => s.setPrice);
  const setExpirationDate = useSubscriptionStore((s) => s.setExpirationDate);

  const initUserLists = useUserListsStore((s) => s.initUserLists);
  const clearUserLists = useUserListsStore((s) => s.clearUserLists);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !userId) {
      checkedEmailRef.current = null;
      setSubscriptionStatus(false);
      setPrice(0);
      setExpirationDate(null);
      setLoading(false);
      clearUserLists();
      return;
    }

    initUserLists(userId);

    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) {
      setLoading(false);
      return;
    }

    if (checkedEmailRef.current === userEmail) return;
    checkedEmailRef.current = userEmail;

    const checkSubscription = async () => {
      try {
        const subscriptionsRef = collection(db, 'Subscriptions');
        const q = query(subscriptionsRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const subscriptionDoc = querySnapshot.docs[0];
          const subscriptionData = subscriptionDoc.data();
          setPrice(subscriptionData.price ?? 0);
          const expDate = subscriptionData.expirationDate?.toDate
            ? subscriptionData.expirationDate.toDate()
            : null;
          setExpirationDate(expDate);

          const isExpired = !expDate || expDate <= new Date();

          if (subscriptionData.status === 'active' && !isExpired) {
            setSubscriptionStatus(true);
          } else {
            setSubscriptionStatus(false);
            if (isExpired && subscriptionData.status === 'active') {
              await updateDoc(doc(db, 'Subscriptions', subscriptionDoc.id), {
                status: 'cancelled',
              });
            }
          }
        } else {
          setSubscriptionStatus(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionStatus(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [
    isLoaded,
    isSignedIn,
    userId,
    user?.primaryEmailAddress?.emailAddress,
    user?.emailAddresses,
    setSubscriptionStatus,
    setPrice,
    setExpirationDate,
    setLoading,
    initUserLists,
    clearUserLists,
  ]);
};