"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import SessionDetailPage, { SupabaseSession } from "@/components/sections/SessionDetailPage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function DynamicSessionPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchSession = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("sessions")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();
        if (data) setSession(data);
        else setNotFound(true);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchSession();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg pt-20 flex items-center justify-center">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400 text-lg font-medium">Loading…</motion.div>
      </div>
    );
  }

  if (notFound || !session) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg pt-20 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">📭</div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Session Not Found</h1>
        <p className="text-gray-500">This session doesn&apos;t exist or is not currently active.</p>
        <a href="/" className="mt-4 px-6 py-2.5 rounded-xl bg-primary-700 text-white font-bold text-sm hover:bg-primary-800 transition-colors">
          Back to Home
        </a>
      </div>
    );
  }

  return <SessionDetailPage session={session} />;
}
