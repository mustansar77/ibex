"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Tag, Search } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface NewsItem { id: string; title: string; content: string; category: string; is_published: boolean; published_at: string; }

const categoryColors: Record<string, string> = {
  Results:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Admissions:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Scholarship: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Achievement: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Events:      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Facility:    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  General:     "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const mockNews: NewsItem[] = [
  { id: "1", title: "MDCAT 2024 Results — IBEX Students Shine", content: "97% of IBEX students qualified MDCAT 2024 with exceptional scores.", category: "Results", is_published: true, published_at: "2024-12-28" },
  { id: "2", title: "T Session Scholarship Applications Open", content: "Merit-based scholarships of 50%-100% now available for deserving students.", category: "Scholarship", is_published: true, published_at: "2024-12-15" },
  { id: "3", title: "IBEX Ranks #1 in Bahawalpur for ECAT", content: "For the third consecutive year, IBEX has produced the highest ECAT qualifiers in Bahawalpur.", category: "Achievement", is_published: true, published_at: "2024-12-05" },
];

const categoryEmoji: Record<string, string> = { Results: "🏆", Admissions: "📚", Scholarship: "🎓", Achievement: "⭐", Events: "🏅", Facility: "💻", General: "📰" };

export default function NewsPage() {
  const [news, setNews]     = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]       = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("news")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });
        setNews(data || []);
      } else {
        setNews(mockNews);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const allCategories = ["All", ...Array.from(new Set(news.map((n) => n.category)))];

  const filtered = news.filter(
    (n) => (cat === "All" || n.category === cat) &&
           (search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-dark-bg pt-20">
      <section className="relative bg-gradient-to-br from-slate-800 to-slate-950 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-4">
              <Newspaper className="w-4 h-4" /> News Feed
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Latest News</h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">Stay updated with achievements, announcements, and developments from IBEX Institute Bahawalpur.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8"><path d="M0,40 C480,5 960,30 1440,0 L1440,40 Z" className="fill-white dark:fill-dark-bg" /></svg>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:outline-none focus:border-primary-500 dark:text-white" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${cat === c ? "bg-primary-700 text-white" : "bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl bg-gray-100 dark:bg-dark-card animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No news found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="group">
                  <div className="h-full bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="p-6">
                      <div className="text-4xl mb-4">{categoryEmoji[item.category] ?? "📰"}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${categoryColors[item.category] || "bg-gray-100 text-gray-600"}`}>
                          <Tag className="w-3 h-3 inline mr-1" />{item.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.published_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white text-base mb-3 leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{item.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
