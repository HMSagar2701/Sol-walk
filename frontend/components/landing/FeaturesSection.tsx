// components/FeaturesSection.tsx
"use client";

import { Wallet, Trophy, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <Wallet className="h-7 w-7 text-purple-400" />,
    title: "Stake to Stay Accountable",
    description:
      "Put SOL tokens on the line. Complete your goals to earn them back plus rewards, or lose them if you fail.",
    bgColor: "bg-purple-500/20",
  },
  {
    icon: <Trophy className="h-7 w-7 text-blue-400" />,
    title: "Compete with Others",
    description:
      "Join group challenges with friends or the community. Compete for the prize pool while staying motivated together.",
    bgColor: "bg-blue-500/20",
  },
  {
    icon: <CheckCircle className="h-7 w-7 text-green-400" />,
    title: "Earn Rewards by Completing Goals",
    description:
      "Earn SOL tokens, NFT badges, and exclusive rewards when you consistently hit your fitness targets.",
    bgColor: "bg-green-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 relative">
      {/* Background Glow */}
      <div className="absolute -top-40 right-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-[100px]" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Sol-Walk?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform combines fitness tracking with blockchain technology to create a powerful accountability
            system.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-shadow duration-300"
            >
              <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
