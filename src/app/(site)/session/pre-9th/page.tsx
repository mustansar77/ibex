"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SessionDetailPage, { SupabaseSession } from "@/components/sections/SessionDetailPage";
import { supabaseAdmin as supabase, isSupabaseConfigured } from "@/lib/supabase";

const FALLBACK: SupabaseSession = {
  id: "pre-9th",
  slug: "pre-9th",
  title: "Pre-9th Session",
  subtitle: "Build Your Foundation Before It Begins",
  description: "Our Pre-9th session is a specially designed summer program for students who have just completed their 8th grade. This intensive program builds the academic foundation, study habits, and subject knowledge needed to excel in 9th grade and beyond.",
  duration: "3 Months",
  timing: "8 AM – 12 PM",
  eligibility: "8th Grade Completed",
  scholarship_info: "",
  features: [
    "Complete syllabus preview for 9th grade (All subjects)",
    "Mathematics: Algebra, Geometry & Problem Solving",
    "Sciences: Physics, Chemistry & Biology basics",
    "English language strengthening & essay writing",
    "Study skills, time management & exam techniques",
    "Regular weekly assessments and feedback",
  ],
  is_active: true,
};

export default function PreNinthPage() {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from("sessions").select("*").eq("slug", "pre-9th").single();
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
