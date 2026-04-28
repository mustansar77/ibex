"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmad Hassan",
    role: "MDCAT Qualified — King Edward Medical University",
    text: "IBEX Institute transformed my preparation completely. The faculty's dedication and the structured mock test program gave me the confidence to score in the top 5% of MDCAT. I owe my medical career to IBEX!",
    score: "MDCAT 185/200",
    stars: 5,
     
  },
  {
    name: "Fatima Zainab",
    role: "ECAT Qualified — UET Lahore",
    text: "The evening coaching program at IBEX was the perfect complement to my college studies. The teachers explained complex engineering concepts in the simplest way possible. Secured admission in UET Lahore!",
    score: "ECAT 90%+",
    stars: 5,
    initial: "F",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Muhammad Bilal",
    role: "NTS Qualified — Government Service",
    text: "I joined IBEX for NTS preparation and it was the best decision of my life. The personalized mentorship and weekly assessments kept me on track. Cleared NTS in my very first attempt!",
    score: "NTS 95%",
    stars: 5,
    initial: "M",
    color: "from-green-500 to-green-700",
  },
  {
    name: "Sana Malik",
    role: "Intermediate Topper — Bahawalpur Board",
    text: "The evening coaching at IBEX helped me score A+ in all my subjects. The teachers are incredibly patient and knowledgeable. My parents couldn't be prouder of my results!",
    score: "1100/1100",
    stars: 5,
    initial: "S",
    color: "from-rose-500 to-rose-700",
  },
  {
    name: "Usman Tariq",
    role: "MDCAT Qualified — Nishtar Medical University",
    text: "What sets IBEX apart is the individual attention every student receives. The doubt-clearing sessions and detailed performance reports helped me identify my weak areas and improve them dramatically.",
    score: "MDCAT 180/200",
    stars: 5,
    initial: "U",
    color: "from-amber-500 to-amber-700",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const getVisible = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((current + i + testimonials.length) % testimonials.length);
    }
    return indices;
  };

  return (
    <section id="testimonials" className="py-16 lg:py-28 bg-gray-50 dark:bg-dark-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            Student Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Voices of{" "}
            <span className="gradient-text">Our Stars</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Real stories from real students who achieved their dreams with IBEX Institute.
          </p>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="relative">
          {/* Desktop — 3 cards */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
            {getVisible().map((idx, position) => {
              const t = testimonials[idx];
              const isCenter = position === 1;
              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.6,
                    scale: isCenter ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`relative bg-white dark:bg-dark-bg rounded-3xl p-6 border transition-all duration-300 ${
                    isCenter
                      ? "border-primary-700/30 shadow-xl"
                      : "border-gray-100 dark:border-dark-border shadow-sm"
                  }`}
                >
                  <Quote className="w-8 h-8 text-primary-700/20 dark:text-primary-400/20 mb-4" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black`}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 text-xs font-bold border border-blue-100 dark:border-primary-900">
                        {t.score}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile — single card */}
          <div className="md:hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-dark-bg rounded-3xl p-6 border border-primary-700/30 shadow-xl"
              >
                <Quote className="w-8 h-8 text-primary-700/20 mb-4" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonials[current].stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  &quot;{testimonials[current].text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-white font-black`}
                  >
                    {testimonials[current].initial}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {testimonials[current].name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonials[current].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-primary-700"
                      : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:border-primary-700 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
