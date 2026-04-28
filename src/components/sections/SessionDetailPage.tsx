"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Info, Clock, Users, BadgePercent } from "lucide-react";
import Link from "next/link";

export interface SupabaseSession {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  timing: string;
  eligibility: string;
  scholarship_info: string;
  features: string[];
  is_active: boolean;
}

// Slug → visual theme mapping; new slugs fall back to default
const THEMES: Record<string, { gradient: string; accent: string; icon: string; badge: string; badgeBg: string }> = {
  "t-session-scholarship": { gradient: "from-primary-600 to-primary-950", accent: "text-blue-100",  icon: "🏆", badge: "Scholarship Program", badgeBg: "bg-primary-500" },
  "pre-9th":               { gradient: "from-primary-700 to-primary-950", accent: "text-blue-200",  icon: "📚", badge: "Summer Program",      badgeBg: "bg-primary-600" },
  "r-session":             { gradient: "from-primary-800 to-primary-950", accent: "text-blue-200",  icon: "🎓", badge: "Year-Round Program",  badgeBg: "bg-primary-700" },
};
const DEFAULT_THEME = { gradient: "from-primary-800 to-primary-950", accent: "text-blue-200", icon: "📖", badge: "Academic Session", badgeBg: "bg-primary-700" };

export default function SessionDetailPage({ session }: { session: SupabaseSession }) {
  const theme = THEMES[session.slug] ?? DEFAULT_THEME;

  const highlights = [
    session.duration   && { label: "Duration",    value: session.duration },
    session.timing     && { label: "Timing",      value: session.timing },
    session.eligibility && { label: "Eligibility", value: session.eligibility },
    session.scholarship_info && { label: "Scholarship", value: "Available" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-white dark:bg-dark-bg">
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${theme.gradient} pt-28 pb-20 overflow-hidden`}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/60">Sessions</span>
              <span>/</span>
              <span className="text-white font-medium">{session.title}</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badgeBg} text-white text-sm font-bold mb-5`}>
              {theme.badge}
            </div>
            <div className="text-6xl mb-4">{theme.icon}</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3">{session.title}</h1>
            <p className={`text-xl font-semibold ${theme.accent} mb-5`}>{session.subtitle}</p>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-10">{session.description}</p>

            {/* Highlights grid */}
            {highlights.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {highlights.map((h) => (
                  <div key={h.label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center">
                    <div className={`text-lg font-black ${theme.accent} mb-1`}>{h.value}</div>
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

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-12">
              {/* Features */}
              {session.features?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">What&apos;s Included</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {session.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                        <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick info */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Session Details</h2>
                <div className="space-y-3">
                  {[
                    { icon: Clock, label: "Duration", value: session.duration },
                    { icon: Clock, label: "Timing",   value: session.timing },
                    { icon: Users, label: "Eligibility", value: session.eligibility },
                    session.scholarship_info && { icon: BadgePercent, label: "Scholarship", value: session.scholarship_info },
                  ].filter(Boolean).map((item) => {
                    if (!item) return null;
                    const { icon: Icon, label, value } = item as { icon: React.ElementType; label: string; value: string };
                    if (!value) return null;
                    return (
                      <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                        <div className="w-9 h-9 rounded-lg bg-primary-700/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Scholarship note */}
              {session.scholarship_info && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-primary-800 dark:text-primary-300 mb-1">Scholarship Info</div>
                      <p className="text-sm text-primary-700 dark:text-primary-400">{session.scholarship_info}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="sticky top-24 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{theme.icon}</div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{session.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{session.subtitle}</p>
                </div>
                <div className="space-y-0 mb-6">
                  {highlights.map((h) => (
                    <div key={h.label} className="flex justify-between items-center py-2.5 border-b border-gray-100 dark:border-dark-border last:border-0">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{h.label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{h.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/apply/entry-test"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all group">
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="w-full flex items-center justify-center mt-3 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                  Contact for Info
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
