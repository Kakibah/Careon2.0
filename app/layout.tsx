import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Careon | Your AI Career Navigator',
  description: 'Advanced AI Career Navigator providing structured, data-driven career guidance for students and early professionals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
