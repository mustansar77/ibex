"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    badge: "Admissions Open 2025",
    title: "Unlock Your",
    highlight: "Academic",
    titleEnd: "Potential",
    desc: "Punjab's most trusted preparatory institute for Entry Tests and Evening Coaching. Expert faculty, proven results since 2014.",
    cta: "Explore Programs",
    ctaHref: "/programs/entry-test",
    secondary: "Learn More",
    secondaryHref: "#about",
    gradient: "from-[#001e3f] via-[#003d7a] to-[#0052a3]",
    accentColor: "text-primary-400",
    stat: { val: "98%", label: "Success Rate" },
  },
  {
    badge: "New Batch Starting Soon",
    title: "MDCAT & ECAT",
    highlight: "Entry Test",
    titleEnd: "Preparation",
    desc: "Comprehensive test prep with weekly mocks, shortcut techniques, one-on-one mentorship and detailed performance analytics.",
    cta: "Apply for Entry Test",
    ctaHref: "/apply/entry-test",
    secondary: "View Program",
    secondaryHref: "/programs/entry-test",
    gradient: "from-[#001020] via-[#003d7a] to-[#005fa3]",
    accentColor: "text-sky-400",
    stat: { val: "185/200", label: "Top MDCAT Score" },
  },
  {
    badge: "Flexible Evening Timings",
    title: "Evening Coaching",
    highlight: "for Academic",
    titleEnd: "Excellence",
    desc: "Expert subject coaching from 4PM–8PM daily. Matric & Intermediate all subjects. Small batches, guaranteed grade improvement.",
    cta: "Join Evening Coaching",
    ctaHref: "/apply/evening-coaching",
    secondary: "View Program",
    secondaryHref: "/programs/evening-coaching",
    gradient: "from-[#12003d] via-[#2d0077] to-[#4a00b4]",
    accentColor: "text-blue-200",
    stat: { val: "5000+", label: "Students Coached" },
  },
  {
    badge: "Limited Seats — Apply Now",
    title: "T Session",
    highlight: "Scholarship",
    titleEnd: "Program",
    desc: "Merit-based scholarships of 50%–100% fee waiver for deserving students. Minimum 80% marks required. Quality education for all.",
    cta: "Apply for Scholarship",
    ctaHref: "/session/t-session-scholarship",
    secondary: "Check Eligibility",
    secondaryHref: "/session/t-session-scholarship",
    gradient: "from-[#1a0000] via-[#7a2000] to-[#a33000]",
    accentColor: "text-primary-400",
    stat: { val: "100%", label: "Max Scholarship" },
  },
  {
    badge: "Bahawalpur's #1 Institute",
    title: "10 Years of",
    highlight: "Excellence",
    titleEnd: "& Trust",
    desc: "Over 5000 alumni placed in top universities and government services across Pakistan. Join the IBEX family today.",
    cta: "See Top Positions",
    ctaHref: "/top-position",
    secondary: "Contact Us",
    secondaryHref: "#contact",
    gradient: "from-[#003300] via-[#005200] to-[#007a00]",
    accentColor: "text-green-300",
    stat: { val: "10+", label: "Years Strong" },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        />
      </AnimatePresence>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Animated blobs */}
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                {slide.badge}
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6">
                {slide.title}
                <span className={`block ${slide.accentColor}`}>{slide.highlight}</span>
                <span className="block">{slide.titleEnd}</span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed mb-8 max-w-xl">
                {slide.desc}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-base shadow-lg shadow-accent-500/30 transition-all group"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={slide.secondaryHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base transition-all"
                >
                  {slide.secondary}
                </Link>
              </div>

              {/* Stat pill */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/20">
                <div className={`text-3xl font-black ${slide.accentColor}`}>{slide.stat.val}</div>
                <div className="text-sm text-white/70">{slide.stat.label}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div className="absolute bottom-16 left-0 right-0 hidden lg:block">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-10">
            {[
              { val: "10+", label: "Years of Excellence" },
              { val: "98%", label: "Success Rate" },
              { val: "5000+", label: "Students" },
              { val: "50+", label: "Expert Faculty" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all z-20">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all z-20">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-accent-500" : "w-2.5 h-2.5 bg-white/40"}`}
          />
        ))}
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 lg:h-16">
          <path d="M0,60 C360,10 1080,40 1440,5 L1440,60 Z" className="fill-white dark:fill-dark-bg" />
        </svg>
      </div>
    </section>
  );
}
