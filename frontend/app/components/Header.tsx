"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Footprints } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-900/80 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo & Branding */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Sol-Walk
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
            Testimonials
          </Link>
        </nav>

        {/* CTA Button */}
        <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
