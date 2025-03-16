"use client";

import { ArrowDown } from "lucide-react";
import { Orbitron } from "next/font/google";
import Link from "next/link";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export default function HeroSection() {
  return (
    <section
      className={`pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden ${orbitron.variable} font-sans`}
    >
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Put Money on Your Goals.
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Win or Lose, Stay Accountable.
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Sol-Walk is the first Accountability-as-a-Service platform built on
            Solana. Stake crypto on your fitness goals and earn rewards for
            staying committed.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Sign in with Google Button */}
            <Link href="https://sol-walk.onrender.com/auth/google" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300 text-base sm:text-lg tracking-wide"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  🚀 Sign in with Google
                </button>
            </Link>

            {/* Optional CTA Button */}
            <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-gray-800/60 border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors text-base sm:text-lg">
              Learn More
            </button>
          </div>

          {/* Tagline */}
          <p className="mt-6 text-gray-400 text-sm sm:text-base">
            It&apos;s time to get paid for showing up for yourself.
          </p>

          {/* Down Arrow */}
          <div className="mt-12 flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
