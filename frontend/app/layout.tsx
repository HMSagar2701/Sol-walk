// app/layout.tsx
import './globals.css'; // ✅ Import global styles here
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Sol-Walk DApp',
  description: 'Group Challenge on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
