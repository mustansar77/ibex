"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award, Users, BookOpen, Star } from "lucide-react";

const floatingCards = [
  { icon: Award, label: "Top Results", value: "98%", color: "from-amber-400 to-amber-500" },
  { icon: Users, label: "Students", value: "5000+", color: "from-blue-400 to-blue-600" },
  { icon: Star, label: "Expert Faculty", value: "50+", color: "from-purple-400 to-purple-600" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-white/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border border-white/5"
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              Bahawalpur, Punjab, Pakistan
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
            >
              Unlock Your
              <span className="block text-accent-500">Academic</span>
              <span className="block">Potential</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg"
            >
              IBEX Institute — Bahawalpur's most trusted preparatory centre. Expert-led
              Entry Test preparation and Evening Coaching to secure your future in top
              universities and colleges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <a
                href="#programs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-base shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 transition-all duration-200 group"
              >
                Explore Programs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                Learn More
              </a>
            </motion.div>

            {/* Mini stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { label: "Years of Excellence", value: "10+" },
                { label: "Success Rate", value: "98%" },
                { label: "Happy Students", value: "5000+" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-blue-200">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — floating cards */}
          <div className="relative hidden lg:flex justify-center items-center">
            {/* Central graphic */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative w-80 h-80"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 rounded-2xl bg-accent-500 flex items-center justify-center mb-4 shadow-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-white">IBEX</div>
                <div className="text-blue-200 text-sm mt-1">Institute of Excellence</div>
                <div className="mt-3 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-400 text-xs font-medium">
                  Est. 2014
                </div>
              </div>

              {/* Floating badges */}
              {floatingCards.map((card, i) => {
                const positions = [
                  "top-0 -right-8",
                  "bottom-12 -right-12",
                  "-left-8 top-1/2 -translate-y-1/2",
                ];
                return (
                  <motion.div
                    key={card.label}
                    className={`absolute ${positions[i]}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-4 min-w-32 border border-gray-100 dark:border-dark-border">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-2`}
                      >
                        <card.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xl font-black text-gray-900 dark:text-white">
                        {card.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Orbit rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-white/10 scale-125"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-accent-500/20 scale-150"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 lg:h-20">
          <path
            d="M0,80 C360,20 1080,60 1440,10 L1440,80 Z"
            className="fill-white dark:fill-dark-bg"
          />
        </svg>
      </div>
    </section>
  );
}
