"use client";

import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-[90vh] flex items-center justify-center text-white bg-black mb-24 overflow-hidden"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url('/images/restaurant-hero.png')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Bean Barrel
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
         Welcome to Beanbarrel where every cup tells a story.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ScrollLink
            to="galary"
            smooth
            duration={500}
            offset={-80}
            className="px-6 py-2.5 bg-white text-black rounded-full shadow hover:bg-neutral-200 transition font-medium cursor-pointer"
          >
            View Gallery
          </ScrollLink>

       

          <ScrollLink
            to="contact"
            smooth
            duration={500}
            offset={-80}
            className="underline text-white/90 hover:text-white text-sm cursor-pointer"
          >
            Contact & Info
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  );
}
