import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default clerkMiddleware(async (_auth, req) => {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return handleI18nRouting(req);
});

export const config = {
  matcher: ['/', '/(ar|en)/:path*'],
};