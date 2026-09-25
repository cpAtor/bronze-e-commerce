import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Heritage Bronze — Heirloom Artisanal Bronze & Sacred Commissions',
  description:
    'Handcrafted ritual and lifestyle bronze wares and bespoke temple deity commissions forged using 3,000-year-old lost-wax casting in Swamimalai.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#202219',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-heritage-dark text-heritage-cream font-sans selection:bg-heritage-cream selection:text-heritage-dark">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
