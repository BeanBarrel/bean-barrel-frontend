import Footer from "@/components/Footer";
import AboutSection from "@/components/Home/AboutSection";
import ContactSection from "@/components/Home/ContactSection";
import GallerySection from "@/components/Home/GallerySection";
import HeroSection from "@/components/Home/HeroSection";

import TestimonialsSection from "@/components/Home/TestimonialsSection";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
      
      
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}