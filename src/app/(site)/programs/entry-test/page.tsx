"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProgramDetailPage, { SupabaseProgram } from "@/components/sections/ProgramDetailPage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK: SupabaseProgram = {
  id: "entry-test",
  slug: "entry-test",
  title: "Entry Test Preparation",
  tagline: "Your Gateway to Top Universities",
  description: "Pakistan's most competitive entry tests demand specialized preparation. At IBEX, our Entry Test program is built around the actual exam patterns, covering every concept systematically with expert faculty, weekly mocks, and proven strategies.",
  duration: "6–12 Months",
  timing: "Morning 7AM–11AM / Evening 4PM–8PM",
  batch_size: "Max 25 Students",
  features: [
    "MDCAT, ECAT, NTS & all entry test coverage",
    "Weekly full-length mock exams with analysis",
    "Concept-building with shortcut techniques",
    "One-on-one doubt-clearing sessions",
    "Detailed performance tracking and reports",
    "Past paper practice with expert explanations",
    "Biology, Chemistry, Physics & Mathematics",
    "English verbal reasoning for NTS/GAT",
    "Time management strategies for exams",
    "Emergency revision sessions before exam date",
  ],
  is_active: true,
};

export default function EntryTestPage() {
  const [program, setProgram] = useState<SupabaseProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("programs").select("*").eq("slug", "entry-test").single();
        setProgram(data || FALLBACK);
      } else {
        setProgram(FALLBACK);
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

  return <ProgramDetailPage program={program!} />;
}
