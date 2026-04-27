"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen, LayoutDashboard, Users, GraduationCap, FlaskConical, Clock,
  Trophy, Newspaper, Bell, Menu, X, LogOut, ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: Users },
  { label: "Enrolled Students", href: "/admin/enrolled", icon: GraduationCap },
  { label: "Programs", href: "/admin/programs", icon: FlaskConical },
  { label: "Sessions", href: "/admin/sessions", icon: Clock },
  { label: "Top Positions", href: "/admin/top-positions", icon: Trophy },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Announcements", href: "/admin/announcements", icon: Bell },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-700 to-primary-600 flex items-center justify-center">
          <BookOpen className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <div className="font-black text-white text-base">IBEX</div>
          <div className="text-[10px] text-gray-500 -mt-0.5 uppercase tracking-widest">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-primary-700 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}>
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 text-sm transition-colors mb-1">
          <BookOpen className="w-4 h-4" /> View Website
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-950/30 text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 shrink-0"><Sidebar /></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-4 bg-gray-900 border-b border-gray-800 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-semibold text-white capitalize">
            {nav.find((n) => pathname.startsWith(n.href))?.label || "Admin"}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
