"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProgramDetailPage, { SupabaseProgram } from "@/components/sections/ProgramDetailPage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK: SupabaseProgram = {
  id: "evening-coaching",
  slug: "evening-coaching",
  title: "Evening Coaching",
  tagline: "Strengthen Your Academic Foundation",
  description: "Our Evening Coaching program is designed for Matric and Intermediate students who want comprehensive subject-by-subject coaching alongside their regular schooling. Expert teachers, small batches, and a structured curriculum ensure guaranteed improvement.",
  duration: "Full Academic Year",
  timing: "4 PM – 8 PM Daily",
  batch_size: "Small Groups",
  features: [
    "Matric & Intermediate — all subjects covered",
    "Physics, Chemistry, Biology, Mathematics",
    "Computer Science and Statistics",
    "Urdu, English & Islamiat",
    "Regular chapter-wise tests and assignments",
    "Homework help and assignment support",
    "Monthly parent-teacher progress meetings",
    "Board exam preparation and past paper practice",
    "Notes and study material provided",
    "Personalized attention in small group setting",
  ],
  is_active: true,
};

export default function EveningCoachingPage() {
  const [program, setProgram] = useState<SupabaseProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("programs").select("*").eq("slug", "evening-coaching").single();
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
