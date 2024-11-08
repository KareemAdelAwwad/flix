import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
  async function checkExpiredSubscriptions() {
    const subscriptionsRef = collection(db, 'Subscriptions');
    const activeSubscriptionsQuery = query(
      subscriptionsRef, 
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(activeSubscriptionsQuery);
    const now = new Date();
    
    const updates = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const expirationDate = data.expirationDate.toDate();
      
      if (now > expirationDate) {
        await updateDoc(doc.ref, {
          status: 'cancelled'
        });
        console.log(`Subscription cancelled for ${data.email} due to expiration`);
      }
    });
    
    await Promise.all(updates);
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