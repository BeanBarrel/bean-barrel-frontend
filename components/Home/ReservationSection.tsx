"use client";

import { useState } from "react";

export default function ReservationSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: 2,
  });

  return (
    <section id="reservation" className="bg-white text-black py-20 px-6 border-t border-gray-200">
      <div className="max-w-2xl mx-auto text-center space-y-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Book a Table</h2>
          <p className="text-gray-600 mt-2">
            Reserve your spot and enjoy an unforgettable meal with us.
          </p>
        </div>

        <form className="space-y-6 text-left">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              className="border rounded-md px-4 py-2 w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your email"
              className="border rounded-md px-4 py-2 w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="flex gap-4">
              <input
                type="date"
                className="border rounded-md px-4 py-2 w-full"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                type="time"
                className="border rounded-md px-4 py-2 w-full"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <select
              className="border rounded-md px-4 py-2 w-full"
              value={form.guests}
              onChange={(e) =>
                setForm({ ...form, guests: parseInt(e.target.value) })
              }
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i > 0 && "s"}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition w-full"
            onClick={(e) => {
              e.preventDefault();
              alert("Reservation submitted (form not connected)");
            }}
          >
            Submit Reservation
          </button>
        </form>
      </div>
    </section>
  );
}
