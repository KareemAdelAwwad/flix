import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSubscriptionStore } from '@/store';

export const useSubscriptionCheck = () => {
  const { user, isSignedIn } = useUser();
  const {
    setSubscriptionStatus,
    setLoading,
    setPrice,
    setExpirationDate
  } = useSubscriptionStore();

  useEffect(() => {
    // Reset state if user is not signed in
    if (!isSignedIn) {
      setSubscriptionStatus(false);
      setPrice(0);
      setExpirationDate(null);
      setLoading(false);
      return;
    }

    const checkSubscription = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        const userEmail = user.emailAddresses[0].emailAddress;
        const subscriptionsRef = collection(db, 'Subscriptions');
        const q = query(subscriptionsRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const subscriptionDoc = querySnapshot.docs[0];
          const subscriptionData = subscriptionDoc.data();
          setPrice(subscriptionData.price);
          const expDate = subscriptionData.expirationDate.toDate();
          setExpirationDate(expDate);

          const now = new Date();
          const isExpired = expDate <= now;

          if (subscriptionData.status === 'active' && !isExpired) {
            setSubscriptionStatus(true);
          } else {
            setSubscriptionStatus(false);
            if (!isExpired) {
              await updateDoc(doc(db, 'Subscriptions', subscriptionDoc.id), {
                status: 'cancelled'
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
  }, [user]);
};