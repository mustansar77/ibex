"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Trophy, Newspaper, Bell, Clock, TrendingUp, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

async function dbCall(body: object) {
  const res = await fetch("/api/admin/db", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  enrolledStudents: number;
  rejectedApplications: number;
  topPositions: number;
  newsArticles: number;
  announcements: number;
}

interface RecentApplication {
  id: string;
  name: string;
  program: string;
  status: string;
  created_at: string;
}

const emptyStats: DashboardStats = {
  totalApplications: 0,
  pendingApplications: 0,
  enrolledStudents: 0,
  rejectedApplications: 0,
  topPositions: 0,
  newsArticles: 0,
  announcements: 0,
};

const statusIcon: Record<string, React.ReactElement> = {
  applied:  <AlertCircle className="w-3.5 h-3.5 text-blue-400" />,
  enrolled: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
  rejected: <XCircle    className="w-3.5 h-3.5 text-red-400" />,
};

const statusBadge: Record<string, string> = {
  applied:  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  enrolled: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const programLabel: Record<string, string> = {
  "entry-test":       "Entry Test",
  "evening-coaching": "Evening Coaching",
};

export default function DashboardPage() {
  const [stats, setStats]             = useState<DashboardStats>(emptyStats);
  const [recent, setRecent]           = useState<RecentApplication[]>([]);
  const [loading, setLoading]         = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);

    const [
      { data: allApps },
      { data: positions },
      { data: newsData },
      { data: annData },
    ] = await Promise.all([
      dbCall({ table: "applications", op: "select", fields: "id, name, program, status, created_at", orderBy: { col: "created_at", asc: false } }),
      dbCall({ table: "top_positions", op: "select", fields: "id" }),
      dbCall({ table: "news", op: "select", fields: "id" }),
      dbCall({ table: "announcements", op: "select", fields: "id" }),
    ]);

    const apps = allApps || [];
    const pending  = apps.filter((a: RecentApplication) => a.status === "applied").length;
    const enrolled = apps.filter((a: RecentApplication) => a.status === "enrolled").length;
    const rejected = apps.filter((a: RecentApplication) => a.status === "rejected").length;

    setStats({
      totalApplications:    apps.length,
      pendingApplications:  pending,
      enrolledStudents:     enrolled,
      rejectedApplications: rejected,
      topPositions:  (positions || []).length,
      newsArticles:  (newsData  || []).length,
      announcements: (annData   || []).length,
    });

    setRecent(apps.slice(0, 6));
    setLastRefreshed(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = [
    { label: "Total Applications", value: stats.totalApplications,  icon: Users,         color: "text-primary-700 dark:text-primary-400", bg: "bg-primary-100 dark:bg-primary-950/40", href: "/admin/applications" },
    { label: "Pending Review",     value: stats.pendingApplications, icon: Clock,         color: "text-amber-700 dark:text-amber-400",    bg: "bg-amber-100 dark:bg-amber-950/40",    href: "/admin/applications" },
    { label: "Enrolled Students",  value: stats.enrolledStudents,   icon: GraduationCap, color: "text-green-700 dark:text-green-400",    bg: "bg-green-100 dark:bg-green-950/40",    href: "/admin/enrolled" },
    { label: "Top Positions",      value: stats.topPositions,       icon: Trophy,        color: "text-yellow-700 dark:text-yellow-400",  bg: "bg-yellow-100 dark:bg-yellow-950/40",  href: "/admin/top-positions" },
    { label: "News Articles",      value: stats.newsArticles,       icon: Newspaper,     color: "text-primary-700 dark:text-primary-400", bg: "bg-primary-100 dark:bg-primary-950/40", href: "/admin/news" },
    { label: "Announcements",      value: stats.announcements,      icon: Bell,          color: "text-primary-600 dark:text-primary-300", bg: "bg-primary-50 dark:bg-primary-950/30",  href: "/admin/announcements" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back, Admin.
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-600">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Alert if pending applications */}
      {stats.pendingApplications > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-bold">{stats.pendingApplications} application{stats.pendingApplications > 1 ? "s" : ""}</span> pending review.
          </p>
          <Link href="/admin/applications" className="ml-auto text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors">
            Review Now →
          </Link>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link href={s.href} className="block group">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-gray-600 transition-all h-full">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-2xl font-black ${s.color} mb-1`}>
                  {loading ? <span className="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /> : s.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Application funnel + Recent Applications */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="font-black text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" /> Application Funnel
          </h2>
          <div className="space-y-3">
            {[
              { label: "Total Received", value: stats.totalApplications,   color: "bg-primary-500", text: "text-primary-700 dark:text-primary-400" },
              { label: "Pending Review", value: stats.pendingApplications,  color: "bg-amber-500",   text: "text-amber-700 dark:text-amber-400" },
              { label: "Enrolled",       value: stats.enrolledStudents,      color: "bg-green-500",   text: "text-green-700 dark:text-green-400" },
              { label: "Rejected",       value: stats.rejectedApplications, color: "bg-red-500",     text: "text-red-700 dark:text-red-400" },
            ].map((row) => {
              const pct = stats.totalApplications > 0
                ? Math.round((row.value / stats.totalApplications) * 100)
                : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                    <span className={`font-bold ${row.text}`}>{row.value}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enrollment rate */}
          {stats.totalApplications > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
              <div className="text-2xl font-black text-green-700 dark:text-green-400">
                {Math.round((stats.enrolledStudents / stats.totalApplications) * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Enrollment Rate</div>
            </div>
          )}
        </motion.div>

        {/* Recent Applications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-400" /> Recent Applications
            </h2>
            <Link href="/admin/applications" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-800 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-800 rounded w-1/4" />
                  </div>
                  <div className="h-5 w-16 bg-gray-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-10 text-center text-gray-600 text-sm">No applications yet.</div>
          ) : (
            <div className="space-y-2">
              {recent.map((app, i) => (
                <motion.div key={app.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-700/30 dark:text-primary-400 flex items-center justify-center font-black text-sm shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.name}</div>
                    <div className="text-xs text-gray-500">{programLabel[app.program] ?? app.program}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize ${statusBadge[app.status] ?? "bg-gray-800 text-gray-400"}`}>
                      {statusIcon[app.status]}
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-600 hidden sm:block">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Review Applications",    href: "/admin/applications",  icon: Users,        desc: `${stats.pendingApplications} pending`,        color: "text-primary-700 dark:text-primary-400",  badge: stats.pendingApplications },
            { label: "Enrolled Students",       href: "/admin/enrolled",       icon: GraduationCap, desc: `${stats.enrolledStudents} active students`,  color: "text-green-700 dark:text-green-400",      badge: 0 },
            { label: "Top Positions",           href: "/admin/top-positions",  icon: Trophy,        desc: "Manage position holders",                     color: "text-amber-700 dark:text-amber-400",      badge: 0 },
            { label: "Post News",               href: "/admin/news",           icon: Newspaper,     desc: "Publish articles to website",                 color: "text-primary-600 dark:text-primary-400",  badge: 0 },
            { label: "Announcements",           href: "/admin/announcements",  icon: Bell,          desc: "What's New section",                          color: "text-primary-700 dark:text-primary-300",  badge: 0 },
            { label: "Programs & Sessions",     href: "/admin/programs",       icon: TrendingUp,    desc: "Edit program details",                        color: "text-primary-700 dark:text-primary-400",  badge: 0 },
          ].map((q, i) => (
            <motion.div key={q.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.05 }}>
              <Link href={q.href} className="block group">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 hover:border-primary-600/60 dark:hover:border-primary-700/60 transition-all group-hover:bg-gray-50 dark:group-hover:bg-gray-800/60">
                  {q.badge > 0 && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                      {q.badge}
                    </span>
                  )}
                  <q.icon className={`w-5 h-5 ${q.color} mb-2.5`} />
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">{q.label}</div>
                  <div className="text-xs text-gray-500">{q.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
