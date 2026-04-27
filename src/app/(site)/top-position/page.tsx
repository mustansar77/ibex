"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Medal, Filter } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Position { id: string; name: string; marks_obtained: number; total_marks: number; board: string; test_type: string; year: string; rank: number; image_url: string; }

const rankBg: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-amber-600",
  2: "bg-gradient-to-br from-gray-300 to-gray-500",
  3: "bg-gradient-to-br from-amber-700 to-amber-900",
};
const rankText: Record<number, string> = { 1: "text-white", 2: "text-gray-800", 3: "text-white" };

const mockData: Position[] = [
  { id: "1", name: "Ahmad Hassan",   marks_obtained: 185,  total_marks: 200,  board: "UHS",              test_type: "MDCAT",  year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Fatima Zainab",  marks_obtained: 183,  total_marks: 200,  board: "UHS",              test_type: "MDCAT",  year: "2024", rank: 2, image_url: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: "3", name: "Muhammad Bilal", marks_obtained: 182,  total_marks: 200,  board: "UHS",              test_type: "MDCAT",  year: "2024", rank: 3, image_url: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "4", name: "Zain Ahmed",     marks_obtained: 1090, total_marks: 1100, board: "Bahawalpur Board", test_type: "Matric", year: "2024", rank: 1, image_url: "https://randomuser.me/api/portraits/men/5.jpg" },
];

export default function TopPositionPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading]     = useState(true);
  const [test, setTest]           = useState("All");
  const [year, setYear]           = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("top_positions")
          .select("*")
          .order("year", { ascending: false })
          .order("rank");
        setPositions(data || []);
      } else {
        setPositions(mockData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const testTypes = ["All", ...Array.from(new Set(positions.map((p) => p.test_type)))];
  const years     = ["All", ...Array.from(new Set(positions.map((p) => p.year))).sort((a, b) => +b - +a)];

  const filtered = positions.filter(
    (p) => (test === "All" || p.test_type === test) && (year === "All" || p.year === year)
  );

  const top3 = filtered.filter((p) => p.rank <= 3).slice(0, 3);
  const showPodium = top3.length === 3;

  return (
    <div className="bg-white dark:bg-dark-bg pt-20">
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-700 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-4 w-fit mx-auto">
              <Trophy className="w-4 h-4 text-amber-400" /> Our Top Achievers
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Position Holders</h1>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">Celebrating the brilliant minds who made IBEX proud with exceptional results.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,40 C480,5 960,30 1440,0 L1440,40 Z" className="fill-white dark:fill-dark-bg" />
          </svg>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-dark-card animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Podium — top 3 */}
              {showPodium && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-center gap-4 mb-16">
                  {/* 2nd */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image src={top3[1].image_url || "https://randomuser.me/api/portraits/men/2.jpg"} alt={top3[1].name} width={80} height={80} className="object-cover" unoptimized />
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-black flex items-center justify-center">2</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-card rounded-t-xl px-4 pt-4 pb-6 w-28">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{top3[1].name}</p>
                      <p className="text-xs text-primary-700 dark:text-primary-300 font-black">{top3[1].marks_obtained}/{top3[1].total_marks}</p>
                      <Medal className="w-4 h-4 text-gray-400 mx-auto mt-1" />
                    </div>
                  </div>
                  {/* 1st */}
                  <div className="text-center -mt-6">
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image src={top3[0].image_url || "https://randomuser.me/api/portraits/men/1.jpg"} alt={top3[0].name} width={96} height={96} className="object-cover" unoptimized />
                        </div>
                      </div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                    </div>
                    <div className="bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-xl px-4 pt-4 pb-8 w-32">
                      <p className="font-black text-sm text-white truncate">{top3[0].name}</p>
                      <p className="text-sm text-white/80 font-bold">{top3[0].marks_obtained}/{top3[0].total_marks}</p>
                      <Trophy className="w-5 h-5 text-white mx-auto mt-1" />
                    </div>
                  </div>
                  {/* 3rd */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image src={top3[2].image_url || "https://randomuser.me/api/portraits/men/3.jpg"} alt={top3[2].name} width={80} height={80} className="object-cover" unoptimized />
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-black flex items-center justify-center">3</div>
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-950/30 rounded-t-xl px-4 pt-4 pb-4 w-28">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{top3[2].name}</p>
                      <p className="text-xs text-primary-700 dark:text-primary-300 font-black">{top3[2].marks_obtained}/{top3[2].total_marks}</p>
                      <Medal className="w-4 h-4 text-amber-700 mx-auto mt-1" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  <Filter className="w-4 h-4" /> Filter:
                </div>
                <div className="flex flex-wrap gap-2">
                  {testTypes.map((t) => (
                    <button key={t} onClick={() => setTest(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${test === t ? "bg-primary-700 text-white" : "bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-200"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 ml-2">
                  {years.map((y) => (
                    <button key={y} onClick={() => setYear(y)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${year === y ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-200"}`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No results found for selected filters.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {filtered.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-shadow text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <div className={`absolute inset-0 rounded-full p-0.5 ${rankBg[p.rank] || "bg-gradient-to-br from-primary-500 to-primary-700"}`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                              <Image src={p.image_url || "https://randomuser.me/api/portraits/men/1.jpg"} alt={p.name} width={80} height={80} className="object-cover" unoptimized />
                            </div>
                          </div>
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${rankBg[p.rank] || "bg-primary-700"} ${rankText[p.rank] || "text-white"}`}>
                            {p.rank}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{p.name}</h3>
                        <p className="text-base font-black text-primary-700 dark:text-primary-300">{p.marks_obtained}/{p.total_marks}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-primary-700/10 text-primary-700 dark:text-primary-300 text-[10px] font-bold">{p.test_type}</span>
                          <span className="text-[10px] text-gray-400">{p.board}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{p.year}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
