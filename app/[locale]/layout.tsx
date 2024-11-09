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

export const metadata: Metadata = {
  title: "Flix App",
  description: "Flix is a subscription-based streaming service that allows our members to watch TV shows and movies on an internet-connected device",
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
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
