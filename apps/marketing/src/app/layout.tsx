import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'OmniCalc — Precision Calculator for Every Platform',
  description:
    'Professional-grade calculator with cloud sync, scientific functions, and cross-platform support. Available on Web, iOS, Android, Windows, macOS, and Linux.',
  keywords: [
    'calculator',
    'scientific calculator',
    'cloud sync',
    'precision math',
    'cross-platform',
  ],
  authors: [{ name: 'OmniCalc Team' }],
  openGraph: {
    title: 'OmniCalc — Precision Calculator for Every Platform',
    description: 'Professional-grade calculator with cloud sync and scientific functions.',
    type: 'website',
    url: 'https://omnicalc.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniCalc — Precision Calculator',
    description: 'Professional-grade calculator with cloud sync and scientific functions.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#f7f9fb] dark:bg-[#0a0a0f] text-[#191c1e] dark:text-[#e8e8f0]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
