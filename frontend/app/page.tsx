import HeroSection from "../components/landing/Hero";
import Header from "../components/landing/Header";
import HowItWorksSection from "../components/landing/how-it-works";
import TestimonialsSection from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import LandingWrapper from "../components/landing/LandingWrapper";

export default function SolWalkLanding() {
  return (
    <LandingWrapper>
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </LandingWrapper>
  );
}