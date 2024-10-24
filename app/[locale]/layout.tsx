import { ThemeProvider } from "@/app/[locale]/theme-provider";
import { NextIntlClientProvider, useMessages } from 'next-intl';
// import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flix App",
  description: "Flix is a subscription-based streaming service that allows our members to watch TV shows and movies on an internet-connected device",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
