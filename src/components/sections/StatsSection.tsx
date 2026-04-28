"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Trophy, Clock, GraduationCap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "Students Enrolled",
    description: "Trusted by thousands of students across Bahawalpur",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    icon: Trophy,
    value: 98,
    suffix: "%",
    label: "Success Rate",
    description: "Our students consistently achieve top results",
    color: "text-primary-600 dark:text-primary-400",
    bg: "bg-primary-50 dark:bg-primary-950/40",
  },
  {
    icon: Clock,
    value: 10,
    suffix: "+",
    label: "Years of Excellence",
    description: "Decade of quality education and mentorship",
    color: "text-primary-600 dark:text-primary-400",
    bg: "bg-blue-50 dark:bg-primary-950/40",
  },
  {
    icon: GraduationCap,
    value: 50,
    suffix: "+",
    label: "Expert Faculty",
    description: "Highly qualified and experienced educators",
    color: "text-primary-600 dark:text-primary-400",
    bg: "bg-primary-50 dark:bg-primary-950/40",
  },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Numbers That{" "}
            <span className="gradient-text">Speak Volumes</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Our track record of excellence proves why IBEX is the preferred choice for
            students across Punjab.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-hover group"
            >
              <div className="relative bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg dark:hover:shadow-none transition-shadow">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-black ${stat.color} mb-1`}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
