"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-16 lg:py-28 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden hero-gradient p-8 sm:p-14 text-white mb-16 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-medium mb-5">
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              Admissions Open Now
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Start Your Journey to
              <span className="block text-accent-400">Success Today</span>
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Don&apos;t wait for tomorrow. Join thousands of successful IBEX students
              and take the first step toward your dream university or career.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+923011182020"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold transition-all shadow-lg shadow-accent-500/30"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href="https://wa.me/923011182020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Phone,
              title: "Call Us",
              lines: ["+92 301-1182020", ],
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-950/40",
              action: "tel:+923011182020",
              actionLabel: "Call Now →",
            },
            {
              icon: Mail,
              title: "Email Us",
              lines: ["ibexcampus@gmail.com", ],
              color: "text-primary-600 dark:text-primary-400",
              bg: "bg-primary-50 dark:bg-primary-950/40",
              action: "mailto:info@ibexinstitute.com",
              actionLabel: "Send Email →",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              lines: ["IBEX Institute", "Bahawalpur, Punjab, Pakistan"],
              color: "text-primary-600 dark:text-primary-400",
              bg: "bg-blue-50 dark:bg-primary-950/40",
              action: "https://maps.google.com/?q=Bahawalpur+Punjab+Pakistan",
              actionLabel: "Get Directions →",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover"
            >
              <div className="h-full bg-white dark:bg-dark-bg rounded-2xl p-6 border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2">
                  {card.title}
                </h3>
                {card.lines.map((line) => (
                  <p key={line} className="text-sm text-gray-600 dark:text-gray-400">
                    {line}
                  </p>
                ))}
                <a
                  href={card.action}
                  target={card.action.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 mt-4 text-sm font-semibold ${card.color} hover:underline group`}
                >
                  {card.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
