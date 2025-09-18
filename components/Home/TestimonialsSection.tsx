"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rojin Philip",
      text: "Cozy coffee shop with perfect rainy-day vibes. (Also have a lot of places to sit around) The coffee is strong enough to power an all nighter, especially recommend butterscotch latte.",
      rating: 5,
      date: "May 2025",
    },
    {
      name: "Nandu Lal",
      text: "Awesome service, nice coffee, butter scotch cookies and brownies, nice ambiance and vibe, good parking space",
      rating: 5,
      date: "April 2025",
    },
    {
      name: "Maya Prakash",
      text: "I had a cappuccino, and it was incredible! The coffee had a perfect balance of boldness and smoothness, with a subtle nutty flavour that lingered nicely.",
      rating: 5,
      date: "March 2025",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 px-6 bg-white text-black border-t border-gray-200">
      <div className="max-w-xl mx-auto text-center space-y-12 overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-bold">What our guests say</h2>

        <div className="relative h-44">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 p-6 bg-neutral-50 rounded-lg shadow-sm flex flex-col justify-center"
            >
              <p className="text-lg text-gray-700 italic">
                “{testimonials[index].text}”
              </p>

              {/* Stars */}
              <div className="mt-4 flex justify-center items-center gap-1 text-yellow-500 text-lg">
                {Array.from({ length: testimonials[index].rating }, (_, i) => (
                  <span key={i}>★</span>
                ))}
                {testimonials[index].rating < 5 && (
                  <>
                    {Array.from(
                      { length: 5 - testimonials[index].rating },
                      (_, i) => (
                        <span key={`empty-${i}`} className="text-gray-300">
                          ★
                        </span>
                      )
                    )}
                  </>
                )}
              </div>

              <p className="mt-2 font-semibold text-gray-800">
                — {testimonials[index].name},{" "}
                <span className="font-normal text-gray-500">
                  {testimonials[index].date}
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
