"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Sun, Moon, BookOpen, ChevronDown,
  GraduationCap, Clock, Award, Newspaper, Bell, FlaskConical,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabaseAdmin as supabase, isSupabaseConfigured } from "@/lib/supabase";

// ─── icon maps ───────────────────────────────────────────────────────────────
const SESSION_ICONS: Record<string, React.ElementType> = {
  "pre-9th": BookOpen,
  "r-session": Clock,
  "t-session-scholarship": Award,
};
const PROGRAM_ICONS: Record<string, React.ElementType> = {
  "entry-test": FlaskConical,
  "evening-coaching": GraduationCap,
};
const SESSION_DESCS: Record<string, string> = {
  "pre-9th": "Summer prep for 9th grade",
  "r-session": "Year-round academic coaching",
  "t-session-scholarship": "Merit-based scholarships",
};
const PROGRAM_DESCS: Record<string, string> = {
  "entry-test": "MDCAT, ECAT, NTS & more",
  "evening-coaching": "Matric & Intermediate",
};

// ─── shared type ─────────────────────────────────────────────────────────────
interface NavItem { label: string; href: string; icon: React.ElementType; desc: string; }

// ─── hardcoded fallback (shown while Supabase loads) ─────────────────────────
const DEFAULT_SESSIONS: NavItem[] = [
  { label: "Pre-9th Session",         href: "/session/pre-9th",              icon: BookOpen,    desc: "Summer prep for 9th grade" },
  { label: "R Session (Regular)",     href: "/session/r-session",            icon: Clock,       desc: "Year-round academic coaching" },
  { label: "T Session Scholarship",   href: "/session/t-session-scholarship", icon: Award,      desc: "Merit-based scholarships" },
];
const DEFAULT_PROGRAMS: NavItem[] = [
  { label: "Entry Test Preparation",  href: "/programs/entry-test",          icon: FlaskConical,  desc: "MDCAT, ECAT, NTS & more" },
  { label: "Evening Coaching",        href: "/programs/evening-coaching",    icon: GraduationCap, desc: "Matric & Intermediate" },
];

const applyLinks = [
  { label: "Apply — Entry Test Prep",  href: "/apply/entry-test",        color: "text-primary-700 dark:text-primary-400" },
  { label: "Apply — Evening Coaching", href: "/apply/evening-coaching",   color: "text-primary-600 dark:text-primary-300" },
];

// ─── dropdown component ───────────────────────────────────────────────────────
function DropdownMenu({ items, isOpen }: { items: NavItem[]; isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors group"
            >
              {item.icon && (
                <div className="w-8 h-8 rounded-lg bg-primary-700/10 dark:bg-primary-700/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary-700/20 transition-colors">
                  <item.icon className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</div>
                {item.desc && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>}
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── main navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // ── live data from Supabase ───────────────────────────────────────────────
  const [navSessions, setNavSessions] = useState<NavItem[]>(DEFAULT_SESSIONS);
  const [navPrograms, setNavPrograms] = useState<NavItem[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const fetchNav = async () => {
      const [{ data: sessions }, { data: programs }] = await Promise.all([
        supabase.from("sessions").select("slug, title, subtitle").eq("is_active", true).order("title"),
        supabase.from("programs").select("slug, title, tagline").eq("is_active", true).order("title"),
      ]);
      if (sessions?.length) {
        setNavSessions(
          sessions.map((s) => ({
            label: s.title,
            href:  `/session/${s.slug}`,
            icon:  SESSION_ICONS[s.slug] ?? BookOpen,
            desc:  SESSION_DESCS[s.slug] ?? s.subtitle ?? "",
          }))
        );
      }
      if (programs?.length) {
        setNavPrograms(
          programs.map((p) => ({
            label: p.title,
            href:  `/programs/${p.slug}`,
            icon:  PROGRAM_ICONS[p.slug] ?? BookOpen,
            desc:  PROGRAM_DESCS[p.slug] ?? p.tagline ?? "",
          }))
        );
      }
    };
    fetchNav();
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => setOpenDropdown((prev) => (prev === name ? null : name));
  const isActive = (href: string) => pathname.startsWith(href);

  // Pages whose hero is a dark blue gradient — navbar uses dark blue background
  const hasDarkHero = pathname === "/" ||
    pathname.startsWith("/session") ||
    pathname.startsWith("/programs") ||
    pathname.startsWith("/whats-new") ||
    pathname.startsWith("/top-position") ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/apply");

  // Navbar text/underline classes — always white on dark pages, dark on light pages
  const navTextClass   = hasDarkHero ? "text-white" : "text-gray-800 dark:text-gray-100";
  const navHoverClass  = hasDarkHero ? "hover:text-blue-200" : "hover:text-primary-700 dark:hover:text-primary-300";
  const underlineClass = hasDarkHero ? "bg-white" : "bg-primary-700 dark:bg-primary-400";

  // Navbar background: always opaque and matched to page theme
  const navBg = hasDarkHero
    ? `bg-primary-900/90 backdrop-blur-md ${scrolled ? "shadow-lg border-b border-primary-700/40" : "border-b border-white/10"}`
    : `bg-white/97 backdrop-blur-md border-b border-gray-200/80 ${scrolled ? "shadow-md" : "shadow-sm"}`;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <Image src="/logo.jpg" alt="IBEX Institute Logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <span className={`block text-xl font-black tracking-wide ${scrolled || hasDarkHero ? "text-white" : "text-primary-700 dark:text-primary-300"}`}>IBEX</span>
              <span className={`block text-[10px] font-medium tracking-widest uppercase -mt-0.5 ${scrolled || hasDarkHero ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>Institute</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* Current Session */}
            <div className="relative group">
              <button onClick={() => toggleDropdown("session")}
                className={`relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass}`}>
                Current Session
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "session" ? "rotate-180" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 ${underlineClass} rounded-full transition-all duration-300 ${
                  isActive("/session") || openDropdown === "session" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </button>
              <DropdownMenu items={navSessions} isOpen={openDropdown === "session"} />
            </div>

            {/* Programs */}
            <div className="relative group">
              <button onClick={() => toggleDropdown("programs")}
                className={`relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass}`}>
                Programs
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "programs" ? "rotate-180" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 ${underlineClass} rounded-full transition-all duration-300 ${
                  isActive("/programs") || openDropdown === "programs" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </button>
              <DropdownMenu items={navPrograms} isOpen={openDropdown === "programs"} />
            </div>

            {/* Top Position */}
            <Link href="/top-position" className={`relative group px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass}`}>
              Top Position
              <span className={`absolute bottom-0 left-0 h-0.5 ${underlineClass} rounded-full transition-all duration-300 ${isActive("/top-position") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            {/* News */}
            <Link href="/news" className={`relative group flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass}`}>
              <Newspaper className="w-3.5 h-3.5" /> News Feed
              <span className={`absolute bottom-0 left-0 h-0.5 ${underlineClass} rounded-full transition-all duration-300 ${isActive("/news") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            {/* What's New */}
            <Link href="/whats-new" className={`relative group flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${navTextClass} ${navHoverClass}`}>
              <Bell className="w-3.5 h-3.5" /> What&apos;s New
              <span className={`absolute bottom-0 left-0 h-0.5 ${underlineClass} rounded-full transition-all duration-300 ${isActive("/whats-new") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${navTextClass} hover:bg-black/10`}
                aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Apply Now */}
            <div className="relative hidden sm:block">
              <button onClick={() => toggleDropdown("apply")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-700 hover:bg-primary-800 text-white text-sm font-bold transition-all shadow-md">
                Apply Now
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "apply" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openDropdown === "apply" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2">Select Program to Apply</p>
                      {applyLinks.map((p) => (
                        <Link key={p.href} href={p.href} className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                          <span className={`text-sm font-semibold ${p.color}`}>{p.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${navTextClass} hover:bg-black/10`}
              aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

              {/* Sessions */}
              <button onClick={() => setMobileExpanded(mobileExpanded === "session" ? null : "session")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                Current Session
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "session" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "session" && (
                <div className="pl-4 space-y-1">
                  {navSessions.map((s) => (
                    <Link key={s.href} href={s.href} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Programs */}
              <button onClick={() => setMobileExpanded(mobileExpanded === "programs" ? null : "programs")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                Programs
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "programs" ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === "programs" && (
                <div className="pl-4 space-y-1">
                  {navPrograms.map((p) => (
                    <Link key={p.href} href={p.href} className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300">
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/top-position" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">Top Position</Link>
              <Link href="/news" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">News Feed</Link>
              <Link href="/whats-new" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">What&apos;s New</Link>

              <div className="pt-3 space-y-2">
                {applyLinks.map((p) => (
                  <Link key={p.href} href={p.href} className="block w-full text-center px-4 py-2.5 rounded-xl bg-primary-700 text-white font-bold text-sm">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
