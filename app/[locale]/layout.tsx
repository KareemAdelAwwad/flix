import { Tajawal } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from "@/app/[locale]/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { arSA, enUS } from '@clerk/localizations'
import { dark } from '@clerk/themes'
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
  },
  title: "Flix App",
  description: "Flix is a subscription-based streaming service that allows our members to watch TV shows and movies on an internet-connected device",
  referrer: 'origin-when-cross-origin',
  keywords: [
    "Flix", "Netflix", "streaming", "movies", "TV shows", "entertainment", "watch", "stream", "subscription", "streaming service",
    "فليكس", "نتفليكس", "بث", "أفلام", "مسلسلات", "ترفيه", "مشاهدة", "بث", "اشتراك", "خدمة بث", "خدمة بث مباشر", "موقع أفلام", "موقع مسلسلات", "موقع ترفيه"
  ],
  authors: [
    { name: 'Kareem Adel', url: 'https://www.kareem-adel.com' },
    { name: 'Ibrahim Wael', url: 'https://github.com/ibrahimwael951' }
  ],
  metadataBase: new URL("https://flix.kareemadel.com"),
  alternates: {
    canonical: 'https://flix.kareemadel.com/',
  },
  openGraph: {
    title: "Flix",
    description: "Flix is a subscription-based streaming service that allows our members to watch TV shows and movies on an internet-connected device",
    url: "https://flix.kareemadel.com",
    siteName: "Flix App",
    images: [
      {
        url: "/meta_bg.png",
        width: 1200,
        height: 630,
        alt: "Flix App - Subscription-based streaming service",
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website",
  }
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <ClerkProvider dynamic localization={locale === "ar" ? arSA : enUS} appearance={{ baseTheme: dark }}>
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <head>
          <script defer data-domain="flix.kareemadel.com" src="https://plausible-plausible.7s4elo.easypanel.host/js/script.js"></script>
        </head>
        <body className={tajawal.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <Header />
              {children}
              <Footer />
            </NextIntlClientProvider>
          </ThemeProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
