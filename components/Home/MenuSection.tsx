"use client";

import { motion } from "framer-motion";

export default function MenuSection() {
  const menu = [
    {
      category: "Starters",
      items: [
        {
          name: "French Onion Soup",
          description: "Slow-cooked onions, melted gruyère, croutons",
          price: "€9",
        },
        {
          name: "Duck Terrine",
          description: "Homemade terrine with fig chutney",
          price: "€11",
        },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Coq au Vin",
          description: "Chicken braised in red wine, mushrooms & lardons",
          price: "€18",
        },
        {
          name: "Steak Frites",
          description: "Grilled sirloin with herb butter and fries",
          price: "€22",
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        {
          name: "Crème Brûlée",
          description: "Vanilla custard with caramelized sugar",
          price: "€8",
        },
        {
          name: "Tarte Tatin",
          description: "Caramelized apple tart with cream",
          price: "€7",
        },
      ],
    },
  ];

  return (
    <section id="menu" className="bg-neutral-50 text-black py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Menu
        </motion.h2>

        {menu.map((section, i) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 + 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {section.category}
            </h3>
            <ul className="space-y-6">
              {section.items.map((item, j) => (
                <motion.li
                  key={item.name}
                  className="flex justify-between items-start border-b pb-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: j * 0.15 }}
                >
                  <div>
                    <h4 className="font-medium text-lg">{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <span className="text-gray-800 font-semibold">
                    {item.price}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
