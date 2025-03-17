// components/landing/LandingWrapper.tsx
import React from 'react';

export default function LandingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white font-sans">
      {children}
    </div>
  );
}