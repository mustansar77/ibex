"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionDetailPage, { SupabaseSession } from "@/components/sections/SessionDetailPage";
import { supabaseAdmin as supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK: SupabaseSession = {
  id: "t-session-scholarship",
  slug: "t-session-scholarship",
  title: "T Session Scholarship",
  subtitle: "Rewarding Merit — Education for All",
  description: "The T Session Scholarship Program is our commitment to making quality education accessible to every deserving student regardless of financial background. Students with exceptional academic merit receive 50% to 100% fee waiver and study alongside the best cohort at IBEX Institute.",
  duration: "Full Academic Year",
  timing: "Morning & Evening",
  eligibility: "Min. 80% marks",
  scholarship_info: "50%–100% fee waiver based on merit test performance. Bring your latest marksheet (minimum 80%) to appear in the selection test. Limited seats — apply early!",
  features: [
    "Merit-based selection through a competitive test",
    "Full or partial scholarship based on merit score",
    "Access to all regular program facilities",
    "Priority enrollment for upcoming exams",
    "Certificate of merit upon completion",
    "Extra mentorship from senior faculty",
    "All subjects — Matric & Intermediate",
    "Monthly performance review to retain scholarship",
  ],
  is_active: true,
};

export default function TSessionScholarshipPage() {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("sessions").select("*").eq("slug", "t-session-scholarship").single();
        setSession(data || FALLBACK);
      } else {
        setSession(FALLBACK);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pt-20 flex items-center justify-center">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-400 text-lg font-medium">Loading…</motion.div>
    </div>
  );

  return <SessionDetailPage session={session!} />;
}
