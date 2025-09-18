"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function GallerySection() {
const images = [
  "/images/gallery/gallery-1.png",
  "/images/gallery/gallery-2.png",
  "/images/gallery/gallery-3.png",
  "/images/gallery/gallery-4.png",
  "/images/gallery/gallery-5.png",
  "/images/gallery/gallery-6.png",
];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="galary" className="bg-neutral-100 text-black py-20 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(src)}
              className="focus:outline-none"
            >
              <Image
                src={src}
                alt={`Gallery ${i + 1}`}
                height={500}
                width={500}
                className="w-full h-64 object-cover rounded-lg shadow-sm hover:opacity-90 transition"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Full view"
              className="max-w-3xl w-full rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
