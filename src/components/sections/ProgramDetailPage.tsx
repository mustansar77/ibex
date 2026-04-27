"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export interface SupabaseProgram {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  timing: string;
  batch_size: string;
  features: string[];
  is_active: boolean;
}

const THEMES: Record<string, { gradient: string; icon: string; accent: string; badgeBg: string; badge: string }> = {
  "entry-test":       { gradient: "from-primary-900 to-primary-700", icon: "🔬", accent: "text-blue-200",   badgeBg: "bg-amber-500",  badge: "Most Popular" },
  "evening-coaching": { gradient: "from-purple-900 to-purple-700",   icon: "🌙", accent: "text-purple-200", badgeBg: "bg-purple-500", badge: "Flexible Timing" },
};
const DEFAULT_THEME = { gradient: "from-primary-800 to-primary-950", icon: "📚", accent: "text-blue-200", badgeBg: "bg-primary-700", badge: "Program" };

export default function ProgramDetailPage({ program }: { program: SupabaseProgram }) {
  const theme = THEMES[program.slug] ?? DEFAULT_THEME;

  const highlights = [
    program.duration   && { label: "Duration",   value: program.duration },
    program.timing     && { label: "Timing",     value: program.timing },
    program.batch_size && { label: "Batch Size", value: program.batch_size },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-white dark:bg-dark-bg">
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${theme.gradient} pt-28 pb-24 overflow-hidden`}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/60">Programs</span>
              <span>/</span>
              <span className="text-white font-medium">{program.title}</span>
            </div>

            <span className={`inline-block px-4 py-1.5 rounded-full ${theme.badgeBg} text-white text-sm font-bold mb-5`}>{theme.badge}</span>
            <div className="text-5xl mb-4">{theme.icon}</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3">{program.title}</h1>
            <p className={`text-xl font-semibold ${theme.accent} mb-5`}>{program.tagline}</p>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed mb-10">{program.description}</p>

            {highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {highlights.map((h) => (
                  <div key={h.label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center">
                    <div className="text-xl font-black text-white mb-1">{h.value}</div>
                    <div className="text-white/60 text-xs">{h.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0,50 C480,10 960,40 1440,5 L1440,50 Z" className="fill-white dark:fill-dark-bg" />
          </svg>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left */}
            <div className="lg:col-span-2 space-y-14">
              {/* Features */}
              {program.features?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">What&apos;s Covered</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {program.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Program Details</h2>
                <div className="space-y-3">
                  {[
                    { icon: Clock,    label: "Duration",   value: program.duration },
                    { icon: Clock,    label: "Timing",     value: program.timing },
                    { icon: Users,    label: "Batch Size", value: program.batch_size },
                  ].filter((d) => d.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                      <div className="w-9 h-9 rounded-lg bg-primary-700/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="sticky top-24 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{theme.icon}</div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg">{program.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{program.tagline}</p>
                </div>
                <div className="mb-6">
                  {[
                    { icon: Clock,    label: "Duration",   value: program.duration },
                    { icon: Clock,    label: "Timing",     value: program.timing },
                    { icon: Users,    label: "Batch Size", value: program.batch_size },
                    { icon: BookOpen, label: "Features",   value: `${program.features?.length ?? 0} included` },
                  ].filter((d) => d.value).map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-gray-100 dark:border-dark-border last:border-0">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <Link href={program.slug === "evening-coaching" ? "/apply/evening-coaching" : "/apply/entry-test"}
                  className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all group">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">Free counseling available — Contact us today</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
