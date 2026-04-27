"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MapPin, BookOpen } from "lucide-react";

const highlights = [
  "Established in 2014 in Bahawalpur, Punjab",
  "Punjab-wide recognition for academic excellence",
  "Dedicated to accessible, quality education",
  "State-of-the-art classrooms and study facilities",
  "Regular parent-teacher communication system",
  "Zero-tolerance policy for distractions during sessions",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-28 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-950 aspect-[4/3] flex items-center justify-center shadow-2xl">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative z-10 text-center px-10">
                <div className="w-24 h-24 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">IBEX</div>
                <div className="text-blue-200 font-medium text-lg">Institute of Excellence</div>
                <div className="flex items-center justify-center gap-2 mt-4 text-blue-200 text-sm">
                  <MapPin className="w-4 h-4" />
                  Bahawalpur, Punjab, Pakistan
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-bg rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-dark-border"
            >
              <div className="text-3xl font-black text-primary-700 dark:text-primary-300">10+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Years of Trust</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -top-6 -left-6 bg-white dark:bg-dark-bg rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-dark-border"
            >
              <div className="text-3xl font-black text-amber-500">5000+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Alumni Strong</div>
            </motion.div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
              About IBEX Institute
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Bahawalpur&apos;s Most{" "}
              <span className="gradient-text">Trusted Institute</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              IBEX Institute was founded with a singular vision: to provide world-class
              preparatory education to the students of Bahawalpur and surrounding areas.
              Since 2014, we have been a beacon of academic excellence in Punjab.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Our institute is built on the pillars of expert teaching, personalized
              attention, and a proven methodology that has helped over 5,000 students
              achieve their academic goals. We offer two focused programs — Entry Test
              Preparation and Evening Coaching — ensuring every student gets specialized
              guidance for their unique needs.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{h}</span>
                </li>
              ))}
            </ul>

            <a
              href="#programs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold shadow-lg hover:shadow-primary-700/30 transition-all"
            >
              Explore Our Programs
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
