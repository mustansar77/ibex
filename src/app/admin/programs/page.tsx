"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, FlaskConical, Clock, Users, BookOpen, RefreshCw } from "lucide-react";

interface ProgramItem { id: string; slug: string; title: string; tagline: string; description: string; duration: string; timing: string; batch_size: string; features: string[]; is_active: boolean; }
const inputClass = "w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-primary-500";
const emptyProgram: Omit<ProgramItem, "id"> = { slug: "", title: "", tagline: "", description: "", duration: "", timing: "", batch_size: "", features: [], is_active: true };

async function dbCall(body: object) {
  const res = await fetch("/api/admin/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<ProgramItem | null>(null);
  const [form, setForm]         = useState<Omit<ProgramItem, "id">>(emptyProgram);
  const [featInput, setFeatInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await dbCall({ table: "programs", op: "select", orderBy: "title" });
    if (err) setError(err);
    setPrograms(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd  = () => { setForm(emptyProgram); setFeatInput(""); setEditing(null); setShowForm(true); };
  const openEdit = (p: ProgramItem) => {
    setForm({ slug: p.slug, title: p.title, tagline: p.tagline, description: p.description, duration: p.duration, timing: p.timing, batch_size: p.batch_size, features: p.features, is_active: p.is_active });
    setFeatInput((p.features || []).join("\n"));
    setEditing(p); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = { ...form, features: featInput.split("\n").map((f) => f.trim()).filter(Boolean) };
    const { error: err } = editing
      ? await dbCall({ table: "programs", op: "update", id: editing.id, data: payload })
      : await dbCall({ table: "programs", op: "insert", data: payload });
    if (err) { setError(err); setSaving(false); return; }
    await fetchData();
    setSaving(false);
    setShowForm(false);
  };

  const toggleActive = async (p: ProgramItem) => {
    await dbCall({ table: "programs", op: "update", id: p.id, data: { is_active: !p.is_active } });
    setPrograms((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
  };

  const handleDelete = async (id: string) => {
    await dbCall({ table: "programs", op: "delete", id });
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Programs</h1>
          <p className="text-gray-400 text-sm mt-1">Manage program information shown on the website</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Add Program
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading…</div>
      ) : programs.length === 0 ? (
        <div className="py-16 text-center text-gray-500">No programs yet.</div>
      ) : (
        <div className="grid gap-4">
          {programs.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <FlaskConical className="w-5 h-5 text-primary-400 shrink-0" />
                    <h2 className="text-lg font-black text-white">{p.title}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.is_active ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"}`}>{p.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  <p className="text-sm text-primary-400 font-medium mb-2">{p.tagline}</p>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" />{p.duration}</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gray-500" />{p.timing}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" />{p.batch_size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(p.features || []).map((f) => (<span key={f} className="px-2.5 py-0.5 rounded-full bg-primary-900/30 text-primary-400 text-xs font-medium">{f}</span>))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toggleActive(p)} className={`p-2 rounded-lg text-xs font-bold transition-colors ${p.is_active ? "bg-green-900/30 text-green-400 hover:bg-green-900/60" : "bg-gray-800 text-gray-500 hover:text-white"}`}>{p.is_active ? "On" : "Off"}</button>
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <h3 className="font-black text-white flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary-400" />{editing ? "Edit" : "Add"} Program</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm">{error}</div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Program Title</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} /></div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">URL Slug</label><input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="entry-test" className={inputClass} /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Tagline</label><input value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Duration</label><input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="6–12 Months" className={inputClass} /></div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Timing</label><input value={form.timing} onChange={(e) => setForm((p) => ({ ...p, timing: e.target.value }))} placeholder="7AM–11AM" className={inputClass} /></div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Batch Size</label><input value={form.batch_size} onChange={(e) => setForm((p) => ({ ...p, batch_size: e.target.value }))} placeholder="Max 40 Students" className={inputClass} /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Features <span className="text-gray-600 font-normal">(one per line)</span></label>
                <textarea rows={5} value={featInput} onChange={(e) => setFeatInput(e.target.value)} placeholder={"MDCAT Coverage\nDaily Practice Tests\nWeekly Mock Exams"} className={`${inputClass} resize-none font-mono text-xs`} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="accent-primary-700 w-4 h-4" />
                <span className="text-sm text-gray-300 font-medium">Active (visible on website)</span>
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
            <h3 className="font-black text-white mb-2">Delete Program?</h3>
            <p className="text-sm text-gray-400 mb-5">This will remove the program from the website.</p>
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
