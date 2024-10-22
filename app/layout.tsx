import { ThemeProvider } from "@/app/theme-provider"
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flix App",
  description: "Flix is a subscription-based streaming service that allows our members to watch TV shows and movies on an internet-connected device",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
