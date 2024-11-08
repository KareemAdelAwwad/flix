import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest } from 'next/server';

const middleware = async (req: NextRequest) => {

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