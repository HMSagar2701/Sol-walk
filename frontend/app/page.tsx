import HeroSection from "./components/Hero"
import Header from "./components/Header"
import HowItWorksSection from "./components/HowItWorksSection"
import TestimonialsSection from "./components/Testimonials"
import Footer from "./components/Footer"

export default function SolWalkLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white font-sans">      
      < Header />
      < HeroSection />
      < HowItWorksSection />
      < TestimonialsSection />
      < Footer />
    </div>
  )
}