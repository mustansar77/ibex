"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, AlertCircle, RefreshCw, Megaphone, Calendar, ChevronRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Announcement { id: string; title: string; content: string; type: string; is_active: boolean; published_at: string; }

const TYPE_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  dot: string;
}> = {
  alert: {
    label: "Alert",
    icon: AlertCircle,
    cardBg: "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
    dot: "bg-red-500",
  },
  update: {
    label: "Update",
    icon: RefreshCw,
    cardBg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  announcement: {
    label: "Announcement",
    icon: Megaphone,
    cardBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};
const DEFAULT_CFG = TYPE_CONFIG.announcement;

const mockData: Announcement[] = [
  { id: "1", title: "Fee Submission Deadline — January 31, 2025", content: "All enrolled students must submit their fees by January 31, 2025. Late submissions will incur a penalty of Rs. 500 per week. Please visit the accounts office between 9 AM – 2 PM.", type: "alert", is_active: true, published_at: "2025-01-05" },
  { id: "2", title: "Parent-Teacher Meeting — February 5, 2025", content: "A parent-teacher meeting is scheduled for February 5, 2025 from 10 AM to 1 PM in the main hall. All parents are requested to attend and bring their child's latest report card.", type: "announcement", is_active: true, published_at: "2024-12-20" },
  { id: "3", title: "Updated Study Schedule for Pre-Board Exams", content: "The study schedule for pre-board exams has been updated. Please check the notice board or contact your class teacher for the revised timetable starting from December 30.", type: "update", is_active: true, published_at: "2024-12-28" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
}

function AnnouncementCard({ item, index }: { item: Announcement; index: number }) {
  const cfg = TYPE_CONFIG[item.type] ?? DEFAULT_CFG;
  const Icon = cfg.icon;
  const isAlert = item.type === "alert";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <div className={`group relative rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md ${cfg.cardBg} ${isAlert ? "ring-1 ring-red-200 dark:ring-red-800/50" : ""}`}>
        {/* Alert pulse indicator */}
        {isAlert && (
          <span className="absolute top-5 right-5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        )}

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
            <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0 pr-6">
            {/* Top row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
                {cfg.label}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(item.published_at)}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">{timeAgo(item.published_at)}</span>
            </div>

            <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg leading-snug mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.content}
            </p>
          </div>

          {/* Arrow */}
          <ChevronRight className={`w-5 h-5 shrink-0 mt-1 transition-transform group-hover:translate-x-1 ${cfg.iconColor} opacity-40 absolute right-5 top-1/2 -translate-y-1/2`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function WhatsNewPage() {
  const [items, setItems]     = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_active", true)
          .order("published_at", { ascending: false });
        setItems(data || []);
      } else {
        setItems(mockData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const types = ["all", ...Array.from(new Set(items.map((i) => i.type)))];
  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);
  const pinned  = filtered.filter((i) => i.type === "alert");
  const regular = filtered.filter((i) => i.type !== "alert");

  return (
    <div className="bg-white dark:bg-dark-bg pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-700 to-indigo-950 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-semibold mb-4">
              <Bell className="w-4 h-4 animate-pulse" /> What&apos;s New
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Announcements</h1>
            <p className="text-indigo-200 text-lg max-w-xl mx-auto">
              Latest updates, alerts, and announcements from IBEX Institute Bahawalpur.
            </p>

            {!loading && items.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium">
                  {items.length} active notice{items.length !== 1 ? "s" : ""}
                </div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-400/30 text-red-200 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
                    {pinned.length} urgent alert{pinned.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,40 C480,5 960,30 1440,0 L1440,40 Z" className="fill-white dark:fill-dark-bg" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter tabs */}
          {!loading && types.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {types.map((t) => {
                const cfg = t === "all" ? null : (TYPE_CONFIG[t] ?? DEFAULT_CFG);
                return (
                  <button key={t} onClick={() => setFilter(t)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      filter === t
                        ? "bg-indigo-700 text-white border-indigo-700 shadow-md"
                        : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-border hover:border-indigo-300"
                    }`}>
                    {cfg && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                    {t === "all" ? "All Notices" : cfg?.label ?? t}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-dark-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-dark-card flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 font-semibold">No announcements at the moment.</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates from IBEX Institute.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pinned alerts */}
              {pinned.length > 0 && (
                <>
                  {pinned.map((item, i) => (
                    <AnnouncementCard key={item.id} item={item} index={i} />
                  ))}
                  {regular.length > 0 && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-gray-100 dark:bg-dark-border" />
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-2">Earlier</span>
                      <div className="flex-1 h-px bg-gray-100 dark:bg-dark-border" />
                    </div>
                  )}
                </>
              )}

              {regular.map((item, i) => (
                <AnnouncementCard key={item.id} item={item} index={pinned.length + i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
