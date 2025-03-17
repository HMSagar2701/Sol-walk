// app/landing-layout.tsx
import type React from "react";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sol-Walk | Accountability-as-a-Service on Solana",
  description:
    "Put money on your goals. Win or lose, stay accountable with Sol-Walk, the Web3 fitness accountability platform built on Solana.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="landing-page">
        {children}
      </body>
    </html>
  );
}