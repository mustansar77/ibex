"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Clock, BadgePercent, Users, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface SessionItem { id: string; slug: string; title: string; subtitle: string; description: string; duration: string; timing: string; eligibility: string; scholarship_info: string; features: string[]; is_active: boolean; }
const inputClass = "w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-primary-500";
const emptySession: Omit<SessionItem, "id"> = { slug: "", title: "", subtitle: "", description: "", duration: "", timing: "", eligibility: "", scholarship_info: "", features: [], is_active: true };

const mockSessions: SessionItem[] = [
  { id: "1", slug: "pre-9th", title: "Pre 9th Session", subtitle: "Head Start Before Grade 9", description: "Preparatory session before Grade 9.", duration: "3 Months", timing: "8AM–12PM", eligibility: "Grade 8 completed", scholarship_info: "", features: ["Mathematics Foundation","Science Concepts"], is_active: true },
  { id: "2", slug: "r-session", title: "R Session", subtitle: "Regular Academic Session", description: "Full year coaching for Matric & Inter.", duration: "Full Year", timing: "4PM–8PM", eligibility: "Matric / Inter Students", scholarship_info: "", features: ["Full Curriculum","Board Exam Focus"], is_active: true },
  { id: "3", slug: "t-session-scholarship", title: "T Session — Scholarship", subtitle: "Merit-Based Scholarships", description: "Scholarships for talented students.", duration: "Full Year", timing: "Morning & Evening", eligibility: "80%+ marks required", scholarship_info: "50%–100% fee waiver based on merit", features: ["Merit Scholarship","Top Faculty"], is_active: true },
];

export default function SessionsAdmin() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<SessionItem | null>(null);
  const [form, setForm]         = useState<Omit<SessionItem, "id">>(emptySession);
  const [featInput, setFeatInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("sessions").select("*").order("title");
      setSessions(data || []);
    } else {
      setSessions(mockSessions);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd  = () => { setForm(emptySession); setFeatInput(""); setEditing(null); setShowForm(true); };
  const openEdit = (s: SessionItem) => {
    setForm({ slug: s.slug, title: s.title, subtitle: s.subtitle, description: s.description, duration: s.duration, timing: s.timing, eligibility: s.eligibility, scholarship_info: s.scholarship_info, features: s.features, is_active: s.is_active });
    setFeatInput((s.features || []).join("\n"));
    setEditing(s); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, features: featInput.split("\n").map((f) => f.trim()).filter(Boolean) };
    if (isSupabaseConfigured) {
      if (editing) await supabase.from("sessions").update(payload).eq("id", editing.id);
      else await supabase.from("sessions").insert([payload]);
      await fetchData();
    } else {
      if (editing) setSessions((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...payload } : s)));
      else setSessions((prev) => [...prev, { ...payload, id: Date.now().toString() }]);
    }
    setSaving(false); setShowForm(false);
  };

  const toggleActive = async (s: SessionItem) => {
    if (isSupabaseConfigured) await supabase.from("sessions").update({ is_active: !s.is_active }).eq("id", s.id);
    setSessions((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from("sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Sessions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage academic sessions displayed on the website</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Add Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading…</div>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center text-gray-500">No sessions yet.</div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                    <h2 className="text-lg font-black text-white">{s.title}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.is_active ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"}`}>{s.is_active ? "Active" : "Inactive"}</span>
                    {s.scholarship_info && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 text-xs font-bold"><BadgePercent className="w-3 h-3" /> Scholarship</span>}
                  </div>
                  <p className="text-sm text-primary-400 font-medium mb-2">{s.subtitle}</p>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
                    {s.duration && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" />{s.duration}</span>}
                    {s.eligibility && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" />{s.eligibility}</span>}
                  </div>
                  {s.scholarship_info && <p className="text-xs text-amber-400 bg-amber-900/20 px-3 py-1.5 rounded-lg mb-3">{s.scholarship_info}</p>}
                  <div className="flex flex-wrap gap-2">
                    {(s.features || []).map((f) => (<span key={f} className="px-2.5 py-0.5 rounded-full bg-amber-900/20 text-amber-300 text-xs font-medium">{f}</span>))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toggleActive(s)} className={`p-2 rounded-lg text-xs font-bold transition-colors ${s.is_active ? "bg-green-900/30 text-green-400 hover:bg-green-900/60" : "bg-gray-800 text-gray-500 hover:text-white"}`}>{s.is_active ? "On" : "Off"}</button>
                  <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" />{editing ? "Edit" : "Add"} Session</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Session Title</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} /></div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">URL Slug</label><input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="t-session-scholarship" className={inputClass} /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Subtitle</label><input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Duration</label><input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="3 Months / Full Year" className={inputClass} /></div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Timing</label><input value={form.timing} onChange={(e) => setForm((p) => ({ ...p, timing: e.target.value }))} placeholder="4PM–8PM" className={inputClass} /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Eligibility</label><input value={form.eligibility} onChange={(e) => setForm((p) => ({ ...p, eligibility: e.target.value }))} placeholder="Students with 80%+ marks" className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Scholarship Info <span className="text-gray-600 font-normal">(leave blank if none)</span></label><input value={form.scholarship_info} onChange={(e) => setForm((p) => ({ ...p, scholarship_info: e.target.value }))} placeholder="50%–100% fee waiver based on merit" className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Features <span className="text-gray-600 font-normal">(one per line)</span></label>
                <textarea rows={4} value={featInput} onChange={(e) => setFeatInput(e.target.value)} placeholder={"Merit-Based Scholarship\nTop Faculty\nMonthly Tests"} className={`${inputClass} resize-none font-mono text-xs`} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="accent-primary-700 w-4 h-4" />
                <span className="text-sm text-gray-300 font-medium">Active (visible in navbar dropdown)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            </div>
          </motion.div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-80">
            <h3 className="font-black text-white mb-2">Delete Session?</h3>
            <p className="text-sm text-gray-400 mb-5">This will remove the session from the website.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
