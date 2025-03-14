// components/Footer.tsx

import { Footprints } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-gradient-to-t from-gray-950 to-gray-900/50 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Sol-Walk
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              The first Accountability-as-a-Service platform built on Solana blockchain.
            </p>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Powered by</span>
              <Image
                src="/solana.png"
                width={24}
                height={204}
                alt="Solana"
                className="h-6 w-auto"
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Sol-Walk. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* Social icons */}
            {/* You can replace the SVGs below with <SocialIcon /> components or icon libs */}
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477..." clipRule="evenodd" /></svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251..." /></svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2..." clipRule="evenodd" /></svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48..." clipRule="evenodd" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
