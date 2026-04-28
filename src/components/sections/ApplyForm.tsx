"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Send, User, BookOpen } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Props {
  program: "entry-test" | "evening-coaching";
  programTitle: string;
  programIcon: string;
  programColor: string;
}

const testTypes = ["MDCAT", "ECAT", "NTS", "GAT", "NUMS", "Other"];
const batches = {
  "entry-test": ["Morning (7AM-11AM)", "Evening (4PM-8PM)", "Crash Course"],
  "evening-coaching": ["Evening Batch A (4-6PM)", "Evening Batch B (6-8PM)", "Weekend Batch"],
};

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

export default function ApplyForm({ program, programTitle, programIcon, programColor }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", father_name: "", cnic: "", email: "", phone: "", address: "",
    matric_marks: "", matric_total: "1100", inter_marks: "", inter_total: "1100",
    school_name: "", college_name: "",
    test_type: program === "entry-test" ? "MDCAT" : "",
    batch_preference: batches[program][0],
    emergency_contact: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name, father_name: form.father_name, cnic: form.cnic,
        email: form.email, phone: form.phone, address: form.address,
        program, test_type: form.test_type || null,
        matric_marks: form.matric_marks ? parseInt(form.matric_marks) : null,
        matric_total: form.matric_total ? parseInt(form.matric_total) : 1100,
        inter_marks: form.inter_marks ? parseInt(form.inter_marks) : null,
        inter_total: form.inter_total ? parseInt(form.inter_total) : 1100,
        school_name: form.school_name || null,
        college_name: form.college_name || null,
        batch_preference: form.batch_preference || null,
        emergency_contact: form.emergency_contact || null,
        status: "applied",
      };

      if (isSupabaseConfigured) {
        const { error: sbError } = await supabase.from("applications").insert([payload]);
        if (sbError) throw new Error(sbError.message);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Send WhatsApp notification to admin (fire-and-forget)
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, program }),
      }).catch(() => {});

      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Thank you, <strong>{form.name}</strong>. Your application for <strong>{programTitle}</strong> has been received.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Our team will contact you within 24 hours at <strong>{form.phone}</strong> to confirm your enrollment.</p>
          <div className="p-4 rounded-2xl bg-primary-700/10 dark:bg-primary-700/20 border border-primary-700/20 text-sm text-primary-700 dark:text-primary-300 font-medium">
            Application ID: IBEX-{Date.now().toString().slice(-6)}
          </div>
          <a href="/" className="mt-6 inline-block px-6 py-3 rounded-xl bg-primary-700 text-white font-bold text-sm hover:bg-primary-800 transition-colors">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg pt-20 pb-16">
      {/* Header */}
      <div className={`bg-gradient-to-br ${programColor} py-16 px-4`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">{programIcon}</div>
          <h1 className="text-3xl font-black text-white mb-2">Apply for {programTitle}</h1>
          <p className="text-white/70">Fill in the form below to start your enrollment at IBEX Institute.</p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex items-center gap-2 ${s < 3 ? "after:content-[''] after:w-12 after:h-0.5 after:bg-white/30" : ""}`}>
                <div className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-all ${step >= s ? "bg-white text-primary-700" : "bg-white/20 text-white/60"}`}>{s}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2 text-xs text-white/60">
            <span>Personal Info</span><span>Academic</span><span>Program</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><User className="w-5 h-5 text-primary-700" />Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className={labelClass}>Full Name *</label><input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Muhammad Ahmad" className={inputClass} /></div>
                  <div><label className={labelClass}>Father&apos;s Name *</label><input required value={form.father_name} onChange={(e) => set("father_name", e.target.value)} placeholder="Muhammad Akbar" className={inputClass} /></div>
                  <div><label className={labelClass}>CNIC / B-Form *</label><input required value={form.cnic} onChange={(e) => set("cnic", e.target.value)} placeholder="31201-1234567-1" className={inputClass} /></div>
                  <div><label className={labelClass}>Email Address *</label><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="student@email.com" className={inputClass} /></div>
                  <div><label className={labelClass}>Phone Number *</label><input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 300-0000000" className={inputClass} /></div>
                  <div><label className={labelClass}>Emergency Contact</label><input value={form.emergency_contact} onChange={(e) => set("emergency_contact", e.target.value)} placeholder="Parent/Guardian number" className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Home Address *</label><textarea required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, Area, City" rows={2} className={`${inputClass} resize-none`} /></div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary-700" />Academic Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div><label className={labelClass}>School Name</label><input value={form.school_name} onChange={(e) => set("school_name", e.target.value)} placeholder="Government High School…" className={inputClass} /></div>
                  <div><label className={labelClass}>College Name</label><input value={form.college_name} onChange={(e) => set("college_name", e.target.value)} placeholder="Govt. College, Bahawalpur…" className={inputClass} /></div>
                  <div>
                    <label className={labelClass}>Matric Marks Obtained</label>
                    <input type="number" value={form.matric_marks} onChange={(e) => set("matric_marks", e.target.value)} placeholder="e.g. 980" min={0} max={1100} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Matric Total Marks</label>
                    <select value={form.matric_total} onChange={(e) => set("matric_total", e.target.value)} className={inputClass}>
                      <option value="1100">1100</option><option value="850">850</option><option value="600">600</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Intermediate Marks Obtained</label>
                    <input type="number" value={form.inter_marks} onChange={(e) => set("inter_marks", e.target.value)} placeholder="e.g. 900" min={0} max={1100} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Intermediate Total Marks</label>
                    <select value={form.inter_total} onChange={(e) => set("inter_total", e.target.value)} className={inputClass}>
                      <option value="1100">1100</option><option value="550">550</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Program Preferences</h2>
                <div className="space-y-5">
                  {program === "entry-test" && (
                    <div>
                      <label className={labelClass}>Which Entry Test are you preparing for? *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {testTypes.map((t) => (
                          <button key={t} type="button" onClick={() => set("test_type", t)}
                            className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${form.test_type === t ? "border-primary-700 bg-primary-700/10 text-primary-700 dark:text-primary-300" : "border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-primary-400"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Preferred Batch *</label>
                    <div className="space-y-3">
                      {batches[program].map((b) => (
                        <label key={b} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.batch_preference === b ? "border-primary-700 bg-primary-700/5" : "border-gray-200 dark:border-dark-border"}`}>
                          <input type="radio" name="batch" checked={form.batch_preference === b} onChange={() => set("batch_preference", b)} className="accent-primary-700" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Summary */}
                  <div className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Application Summary</h4>
                    <div className="space-y-1.5 text-sm">
                      {[["Name", form.name], ["Phone", form.phone], ["Program", programTitle], ["Test", form.test_type || "—"], ["Batch", form.batch_preference]].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-500">{k}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                ← Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && (!form.name || !form.cnic || !form.phone || !form.address)) { setError("Please fill all required fields."); return; }
                  setError(""); setStep((s) => s + 1);
                }}
                className="px-8 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-sm transition-all disabled:opacity-60">
                <Send className="w-4 h-4" />
                {loading ? "Submitting…" : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
