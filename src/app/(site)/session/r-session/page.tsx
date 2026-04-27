"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionDetailPage, { SupabaseSession } from "@/components/sections/SessionDetailPage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK: SupabaseSession = {
  id: "r-session",
  slug: "r-session",
  title: "R Session",
  subtitle: "Regular Academic Coaching — Year Round",
  description: "The R Session (Regular Session) is our flagship year-long coaching program covering the complete Matric and Intermediate curriculum. With expert subject teachers, regular assessments, and personalized feedback, this program ensures consistent academic growth throughout the year.",
  duration: "Full Academic Year",
  timing: "4 PM – 8 PM Daily",
  eligibility: "Matric / Intermediate",
  scholarship_info: "",
  features: [
    "Complete Matric & Intermediate curriculum (All subjects)",
    "Expert subject specialists for every subject",
    "Monthly comprehensive assessments",
    "Homework assistance and assignment support",
    "Regular parent-teacher communication meetings",
    "Study notes and material provided",
    "Board exam preparation in final months",
    "Past paper practice with detailed solutions",
  ],
  is_active: true,
};

export default function RSessionPage() {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("sessions").select("*").eq("slug", "r-session").single();
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
