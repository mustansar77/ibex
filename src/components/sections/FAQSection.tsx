"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What programs does IBEX Institute offer?",
    answer:
      "IBEX Institute offers two main programs: Entry Test Preparation (covering MDCAT, ECAT, NTS, and all major entry tests) and Evening Coaching (subject-specific coaching for Matric and Intermediate students). Both programs are designed to ensure maximum academic success.",
  },
  {
    question: "How is IBEX different from other institutes in Bahawalpur?",
    answer:
      "IBEX stands out through its small batch sizes (maximum 25 students), highly qualified subject specialists, personalized mentorship, regular performance analytics, and a decade-long proven track record of success. We prioritize quality over quantity to ensure every student gets the attention they deserve.",
  },
  {
    question: "What is the duration of the Entry Test Preparation program?",
    answer:
      "The Entry Test Preparation program runs for 6 to 12 months depending on the target exam and your current preparation level. We offer both short-term intensive courses and comprehensive long-term programs. Our counselors will recommend the best duration for your specific goals.",
  },
  {
    question: "What are the timings for the Evening Coaching program?",
    answer:
      "Evening Coaching sessions run from 4 PM to 8 PM on weekdays. We offer flexible scheduling with multiple subject slots so students can attend the classes that fit their regular school schedule. Specific timetables are shared upon enrollment.",
  },
  {
    question: "How do I enroll in IBEX Institute?",
    answer:
      "Enrollment is simple! Visit our institute in Bahawalpur, contact us through our phone or WhatsApp, or fill in the contact form on this website. Our counseling team will guide you through program selection, batch availability, and the admission process.",
  },
  {
    question: "Does IBEX provide study material?",
    answer:
      "Yes! All enrolled students receive comprehensive study notes, past paper compilations, and practice books curated by our expert faculty. Entry Test students also get access to our in-house question bank and mock test series.",
  },
  {
    question: "What is the fee structure?",
    answer:
      "Fee structures vary by program and batch. We offer competitive pricing and flexible payment plans. Please contact us directly for the latest fee schedule. IBEX is committed to making quality education accessible — ask about our scholarship opportunities.",
  },
  {
    question: "Do you offer any trial classes?",
    answer:
      "Yes, we offer demo or trial classes for new students so you can experience the IBEX teaching methodology before making a commitment. Contact us to schedule a free trial class for any of our programs.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-28 bg-white dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-700/10 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Got Questions?{" "}
            <span className="gradient-text">We&apos;ve Got Answers</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know about IBEX Institute and our programs.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIndex === i
                  ? "border-primary-700/40 bg-primary-700/5 dark:bg-primary-700/10"
                  : "border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span
                  className={`font-semibold text-sm sm:text-base ${
                    openIndex === i
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={`shrink-0 ${
                    openIndex === i
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-gray-400"
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-primary-700/10 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10"
        >
          Still have questions?{" "}
          <a href="#contact" className="text-primary-700 dark:text-primary-300 font-semibold hover:underline">
            Contact our team →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
