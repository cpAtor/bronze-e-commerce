import type { Metadata, Viewport } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Heritage Bronze | Artisanal Panchaloha & Sacred Temple Commissions',
  description:
    'Handcrafted ritual and lifestyle bronze wares and bespoke temple deity commissions forged using 3,000-year-old lost-wax casting in Swamimalai, Tamil Nadu.',
  keywords: [
    'Bronze',
    'Panchaloha',
    'Lost-Wax Casting',
    'Temple Murti',
    'Nataraja',
    'Kansa',
    'Artisanal Bronze',
    'Swamimalai',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-parchment-100 text-bronze-950 font-sans selection:bg-gold-500/30 selection:text-bronze-950">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
