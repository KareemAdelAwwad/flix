import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

// Cache mechanism
let lastCheckTime = 0;
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

async function checkExpiredSubscriptions() {
  const now = Date.now();
  
  // Return early if not enough time has passed
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return;
  }
  
  lastCheckTime = now;
  
  const subscriptionsRef = collection(db, 'Subscriptions');
  const activeSubscriptionsQuery = query(
    subscriptionsRef, 
    where('status', '==', 'active')
  );
  
  const querySnapshot = await getDocs(activeSubscriptionsQuery);
  
  const updates = querySnapshot.docs.map(async (doc) => {
    const data = doc.data();
    const expirationDate = data.expirationDate.toDate();
    
    if (now > expirationDate.getTime()) {
      await updateDoc(doc.ref, {
        status: 'cancelled'
      });
      console.log(`Subscription cancelled for ${data.email}`);
    }
  });
  
  await Promise.all(updates);
}

const middleware = async (req: NextRequest) => {
  // Skip subscription check for webhook and static assets
  if (!req.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico)$/)) {
    await checkExpiredSubscriptions();
  }

  // Skip Clerk middleware for webhook endpoint
  if (req.nextUrl.pathname === '/api/webhook') {
    return NextResponse.next();
  }

  const intlMiddleware = createMiddleware(routing)(req);
  if (intlMiddleware) return intlMiddleware;

  return clerkMiddleware(req, {} as NextFetchEvent);
};

export default middleware;

export const config = {
  matcher: [
    '/', 
    '/(ar|en)/:path*', 
    '/api/webhook'
  ]
};