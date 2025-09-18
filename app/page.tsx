import Footer from "@/components/Footer";
import AboutSection from "@/components/Home/AboutSection";
import ContactSection from "@/components/Home/ContactSection";
import GallerySection from "@/components/Home/GallerySection";
import HeroSection from "@/components/Home/HeroSection";
import MenuSection from "@/components/Home/MenuSection";
import ReservationSection from "@/components/Home/ReservationSection";
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