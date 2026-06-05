import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnalyticsConsent from '@/components/AnalyticsConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Just another blog about Sitecore, tips and tricks',
    template: '%s | Alex van Wolferen',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description:
    'I am a Sitecore Architect. Father of Luuk and Fenna, fiancé of Marloes, hoarder of electronics. Loves to learn something new every single day.',
  authors: [{ name: 'Alex van Wolferen', url: 'https://www.alexvanwolferen.nl' }],
  creator: 'Alex van Wolferen',
  metadataBase: new URL('https://www.alexvanwolferen.nl'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.alexvanwolferen.nl',
    title: 'Just another blog about Sitecore, tips and tricks',
    description:
      'I am a Sitecore Architect. Father of Luuk and Fenna, fiancé of Marloes, hoarder of electronics. Loves to learn something new every single day.',
    siteName: 'Alex van Wolferen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Just another blog about Sitecore, tips and tricks',
    description:
      'I am a Sitecore Architect. Father of Luuk and Fenna, fiancé of Marloes, hoarder of electronics. Loves to learn something new every single day.',
    creator: '@avwolferen',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
