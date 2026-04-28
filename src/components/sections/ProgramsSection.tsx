"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FlaskConical, Moon, CheckCircle2, ArrowRight, Clock, Users, BookOpen } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ProgramItem {
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

const SLUG_THEME: Record<string, { gradient: string; icon: React.ElementType; badge: string; badgeBg: string; accentColor: string }> = {
  "entry-test":       { gradient: "from-primary-700 to-primary-900", icon: FlaskConical, badge: "Most Popular",   badgeBg: "bg-primary-600",  accentColor: "text-primary-400" },
  "evening-coaching": { gradient: "from-primary-700 to-primary-900",   icon: Moon,         badge: "Flexible Timing", badgeBg: "bg-primary-600", accentColor: "text-blue-200" },
};
const DEFAULT_THEME = { gradient: "from-gray-700 to-gray-900", icon: BookOpen, badge: "Program", badgeBg: "bg-gray-500", accentColor: "text-gray-300" };

const mockPrograms: ProgramItem[] = [
  { id: "1", slug: "entry-test",       title: "Entry Test Preparation", tagline: "Your Gateway to Top Universities",       description: "Comprehensive preparation for MDCAT, ECAT, NTS, and all major entry tests.",                duration: "6–12 Months",       timing: "Morning & Evening", batch_size: "Max 25", features: ["MDCAT, ECAT, NTS coverage","Weekly mock exams","Expert faculty"], is_active: true },
  { id: "2", slug: "evening-coaching", title: "Evening Coaching",       tagline: "Strengthen Your Academic Foundation",   description: "Subject-specific coaching for Matric & Inter students alongside regular schooling.", duration: "Full Academic Year", timing: "4 PM – 8 PM",       batch_size: "Small Groups", features: ["All subjects covered","Regular assessments","Board exam prep"],      is_active: true },
];

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("programs")
          .select("*")
          .eq("is_active", true)
          .order("title");
        setPrograms(data || []);
      } else {
        setPrograms(mockPrograms);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section id="programs" className="py-16 lg:py-28 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            Our Programs
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Two Programs,{" "}
            <span className="gradient-text">One Goal</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Whether you&apos;re preparing for a competitive entry test or need comprehensive
            academic coaching, IBEX has the perfect program tailored for your success.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-gray-200 dark:bg-dark-bg animate-pulse" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No programs available.</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program, i) => {
              const theme = SLUG_THEME[program.slug] ?? DEFAULT_THEME;
              const Icon = theme.icon;
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="group relative"
                >
                  {program.slug === "entry-test" && (
                    <div className="absolute -top-3 left-6 z-10">
                      <span className="px-4 py-1 rounded-full bg-primary-600 text-white text-xs font-bold shadow-lg">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}

                  <div className="h-full rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-border shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                    {/* Card Header */}
                    <div className={`bg-gradient-to-br ${theme.gradient} p-8 text-white`}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className={`px-3 py-1 rounded-full ${theme.badgeBg} text-white text-xs font-bold`}>
                          {theme.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mb-1">{program.title}</h3>
                      <p className={`text-sm font-medium ${theme.accentColor} mb-3`}>{program.tagline}</p>
                      <p className="text-white/80 text-sm leading-relaxed">{program.description}</p>

                      <div className="flex flex-wrap gap-4 mt-5">
                        {program.duration && (
                          <div className="flex items-center gap-1.5 text-white/80 text-xs">
                            <Clock className="w-3.5 h-3.5" /> {program.duration}
                          </div>
                        )}
                        {program.batch_size && (
                          <div className="flex items-center gap-1.5 text-white/80 text-xs">
                            <Users className="w-3.5 h-3.5" /> {program.batch_size}
                          </div>
                        )}
                        {program.timing && (
                          <div className="flex items-center gap-1.5 text-white/80 text-xs">
                            <BookOpen className="w-3.5 h-3.5" /> {program.timing}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="bg-white dark:bg-dark-card p-8 flex flex-col flex-1">
                      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        What&apos;s Included
                      </h4>
                      <ul className="space-y-3 flex-1">
                        {(program.features || []).map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/programs/${program.slug}`}
                        className={`mt-8 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm transition-all duration-200 group/btn bg-gradient-to-r ${theme.gradient} hover:opacity-90 hover:shadow-lg`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 dark:text-gray-500 mt-10"
        >
          Not sure which program is right for you?{" "}
          <a href="#contact" className="text-primary-700 dark:text-primary-300 font-semibold hover:underline">
            Contact us for free counseling →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
