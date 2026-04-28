"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  BarChart3,
  MessageCircle,
  Shield,
  Lightbulb,
  Clock,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Expert Faculty",
    description:
      "Our teachers are subject specialists with years of experience in competitive exam preparation and academic coaching.",
    color: "from-blue-500 to-blue-700",
    light: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Target,
    title: "Result-Oriented Approach",
    description:
      "Every lesson is structured around exam patterns and scoring strategies to maximize your performance on test day.",
    color: "from-amber-500 to-amber-700",
    light: "bg-primary-50 dark:bg-primary-950/40",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Regular assessments and detailed performance reports help you track progress and identify areas for improvement.",
    color: "from-green-500 to-green-700",
    light: "bg-blue-50 dark:bg-primary-950/40",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
  {
    icon: MessageCircle,
    title: "Personalized Mentorship",
    description:
      "Students receive individual attention and one-on-one mentoring to address their unique academic challenges.",
    color: "from-purple-500 to-purple-700",
    light: "bg-primary-50 dark:bg-primary-950/40",
    iconColor: "text-primary-600 dark:text-primary-400",
  },
  {
    icon: Shield,
    title: "Proven Track Record",
    description:
      "10+ years of consistent excellence with thousands of students successfully placed in top universities and colleges.",
    color: "from-rose-500 to-rose-700",
    light: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: Lightbulb,
    title: "Concept-Based Learning",
    description:
      "We focus on deep understanding over rote memorization, giving students the tools to solve any problem.",
    color: "from-yellow-500 to-yellow-700",
    light: "bg-yellow-50 dark:bg-yellow-950/40",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Multiple batch timings accommodate every student's schedule, from early morning to evening sessions.",
    color: "from-teal-500 to-teal-700",
    light: "bg-teal-50 dark:bg-teal-950/40",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    icon: Heart,
    title: "Supportive Environment",
    description:
      "A nurturing, stress-free learning environment where every student is encouraged to grow and excel with confidence.",
    color: "from-pink-500 to-pink-700",
    light: "bg-pink-50 dark:bg-pink-950/40",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
];

export default function WhyIbexSection() {
  return (
    <section id="why-ibex" className="py-16 lg:py-28 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              The IBEX{" "}
              <span className="gradient-text">Difference</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              At IBEX Institute, we don&apos;t just teach — we transform students into
              confident achievers. Our methodology combines academic rigor with
              personalized mentorship to bring out the best in every student.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Based in the heart of Bahawalpur, Punjab, we&apos;ve built a reputation
              for excellence through consistent results, dedicated faculty, and a
              deep commitment to every student&apos;s success.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Bahawalpur's #1", sub: "Prep Institute" },
                { label: "Punjab-Wide", sub: "Top Placements" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-primary-700/5 dark:bg-primary-700/10 border border-primary-700/20"
                >
                  <div className="font-black text-primary-700 dark:text-primary-300 text-lg">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — large feature highlight */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-950 p-8 text-white shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-bold text-sm">{f.title}</div>
                    <div className="text-white/60 text-xs mt-1 leading-snug line-clamp-2">
                      {f.description}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-accent-500/20 border border-accent-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-black text-lg">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-sm">Director — IBEX Institute</div>
                    <div className="text-white/60 text-xs">
                      &quot;Our mission is to make quality education accessible to every student
                      in Bahawalpur.&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="card-hover group"
            >
              <div className="h-full bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.light} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
