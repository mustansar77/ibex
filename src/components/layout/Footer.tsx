"use client";

import { motion } from "framer-motion";
import { BookOpen, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  Programs: [
    { label: "Entry Test Preparation", href: "#programs" },
    { label: "Evening Coaching", href: "#programs" },
    { label: "MDCAT Prep", href: "#programs" },
    { label: "ECAT Prep", href: "#programs" },
    { label: "NTS Prep", href: "#programs" },
  ],
  Institute: [
    { label: "About IBEX", href: "#about" },
    { label: "Why Choose Us", href: "#why-ibex" },
    { label: "Our Faculty", href: "#why-ibex" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ],
  Contact: [
    { label: "Admissions", href: "#contact" },
    { label: "Free Counseling", href: "#contact" },
    { label: "WhatsApp", href: "https://wa.me/923011182020" },
    { label: "Call Us", href: "tel:+923011182020" }, 
    { label: "Email Us", href: "mailto:info@ibexinstitute.com" },
  ],
};

const socials = [
  {
    href: "#",
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "X (Twitter)",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-950 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-black tracking-wide">IBEX</div>
                <div className="text-[10px] text-white/50 tracking-widest uppercase -mt-0.5">
                  Institute
                </div>
              </div>
            </motion.div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              {/* Bahawalpur&apos;s premier preparatory institute — shaping futures through
              expert Entry Test preparation and Evening Coaching since 2014. */}

               Your Gateway to Success in Medical and Engineering Fields!
            </p>
            <div className="space-y-2.5 mb-6">
              {[
                { icon: MapPin, text: "11-D Gulberg Road Near Chase Value Center Model Town A, Bahawalpur, Bahawalpur, Pakistan" },
                { icon: Phone, text: "+92 3011182020" },
                { icon: Mail, text: "ibexcampus@gmail.com" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-sm text-white/60">
                  <item.icon className="w-4 h-4 text-accent-500 shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent-500 flex items-center justify-center transition-colors"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-bold text-white mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-sm text-white/40">
          <p>© {new Date().getFullYear()} IBEX Institute, Bahawalpur. All rights reserved.</p>
          <p>
            Designed with ❤️ for students of Bahawalpur
          </p>
        </div>
      </div>
    </footer>
  );
}
