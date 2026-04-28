"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Position {
  id: string;
  name: string;
  marks_obtained: number;
  total_marks: number;
  board: string;
  test_type: string;
  year: string;
  rank: number;
  image_url: string;
}

const mockToppers: Position[] = [
  { id: "1", name: "Ahmad Hassan",   marks_obtained: 185,  total_marks: 200,  board: "UHS",      test_type: "MDCAT",  year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Fatima Zainab",  marks_obtained: 183,  total_marks: 200,  board: "UHS",      test_type: "MDCAT",  year: "2024", rank: 2, image_url: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: "3", name: "Muhammad Bilal", marks_obtained: 182,  total_marks: 200,  board: "UHS",      test_type: "MDCAT",  year: "2024", rank: 3, image_url: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "4", name: "Ayesha Noor",    marks_obtained: 450,  total_marks: 500,  board: "BWP",      test_type: "ECAT",   year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: "5", name: "Ali Raza",       marks_obtained: 445,  total_marks: 500,  board: "BWP",      test_type: "ECAT",   year: "2024", rank: 2, image_url: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "6", name: "Zain Ahmed",     marks_obtained: 1090, total_marks: 1100, board: "BWP Board", test_type: "Matric", year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/men/5.jpg" },
  { id: "7", name: "Sara Iqbal",     marks_obtained: 1075, total_marks: 1100, board: "BWP Board", test_type: "Inter",  year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/women/6.jpg" },
  { id: "8", name: "Mahnoor Aslam",  marks_obtained: 1085, total_marks: 1100, board: "BWP Board", test_type: "Matric", year: "2024", rank: 2, image_url: "https://randomuser.me/api/portraits/women/5.jpg" },
];

const gradients = [
  "from-amber-400 to-amber-600",
  "from-gray-300 to-gray-500",
  "from-amber-600 to-amber-800",
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-purple-400 to-purple-600",
  "from-rose-400 to-rose-600",
  "from-sky-400 to-sky-600",
];

const rankBadge: Record<number, string> = {
  1: "bg-primary-400 text-white",
  2: "bg-gray-300 text-gray-800",
  3: "bg-primary-800 text-white",
};

export default function TopPositionsSection() {
  const [toppers, setToppers] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("top_positions")
          .select("*")
          .order("year", { ascending: false })
          .order("rank")
          .limit(8);
        setToppers(data || []);
      } else {
        setToppers(mockToppers);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-dark-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">
              <Trophy className="w-4 h-4" />
              Our Top Achievers
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Position Holders{" "}
              <span className="gradient-text">& Toppers</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-lg">
              Celebrating the exceptional students who made IBEX proud with outstanding results.
            </p>
          </div>
          <Link
            href="/top-position"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary-700 text-primary-700 dark:text-primary-300 dark:border-primary-500 font-bold text-sm hover:bg-primary-700 hover:text-white dark:hover:bg-primary-700 dark:hover:text-white transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-dark-bg animate-pulse" />
            ))}
          </div>
        ) : toppers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No position holders added yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {toppers.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="card-hover group"
              >
                <div className="bg-white dark:bg-dark-bg rounded-2xl p-5 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-shadow text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} p-0.5`}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={t.image_url || "https://randomuser.me/api/portraits/men/1.jpg"}
                          alt={t.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${rankBadge[t.rank] || "bg-primary-700 text-white"}`}>
                      {t.rank}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                    {t.name}
                  </h3>
                  <div className="text-xs font-black text-primary-700 dark:text-primary-300 mb-1">
                    {t.marks_obtained}/{t.total_marks}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 text-[10px] font-bold">
                      {t.test_type}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{t.board}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{t.year}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
