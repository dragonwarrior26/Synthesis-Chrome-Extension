import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Synthesis - The Future of Browsing',
  description: 'Manage tabs intelligently, protect your privacy, and reclaim your browser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={clsx(inter.className, "bg-black text-white antialiased min-h-screen selection:bg-white/20")}>
        {children}
      </body>
    </html>
  );
}
