"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Bell, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import { supabaseAdmin as supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Ann { id: string; title: string; content: string; type: string; is_active: boolean; published_at: string; }
const types = ["announcement","update","alert"];
const inputClass = "w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-primary-500";
const empty = { title: "", content: "", type: "announcement", is_active: true, published_at: new Date().toISOString().split("T")[0] };
const typeBadge: Record<string, string> = { announcement: "bg-blue-900/40 text-blue-400", update: "bg-green-900/40 text-green-400", alert: "bg-red-900/40 text-red-400" };

const mockAnns: Ann[] = [
  { id: "1", title: "Fee Submission Deadline — January 31", content: "All enrolled students must submit fees by Jan 31.", type: "alert", is_active: true, published_at: "2025-01-05" },
  { id: "2", title: "Parent-Teacher Meeting — Feb 5", content: "PTM scheduled for Feb 5 from 10 AM to 1 PM.", type: "announcement", is_active: true, published_at: "2024-12-20" },
];

export default function AnnouncementsAdmin() {
  const [anns, setAnns]         = useState<Ann[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Ann | null>(null);
  const [form, setForm]         = useState(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("announcements").select("*").order("published_at", { ascending: false });
      setAnns(data || []);
    } else {
      setAnns(mockAnns);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (a: Ann) => {
    setForm({ title: a.title, content: a.content, type: a.type, is_active: a.is_active, published_at: a.published_at?.split("T")[0] ?? "" });
    setEditing(a); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString() };
    if (isSupabaseConfigured) {
      if (editing) await supabase.from("announcements").update(payload).eq("id", editing.id);
      else await supabase.from("announcements").insert([payload]);
      await fetchData();
    } else {
      if (editing) setAnns((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)));
      else setAnns((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setSaving(false); setShowForm(false);
  };

  const toggle = async (a: Ann) => {
    if (isSupabaseConfigured) await supabase.from("announcements").update({ is_active: !a.is_active }).eq("id", a.id);
    setAnns((prev) => prev.map((x) => (x.id === a.id ? { ...x, is_active: !x.is_active } : x)));
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from("announcements").delete().eq("id", id);
    setAnns((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">Manage What&apos;s New announcements</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Add Announcement
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading…</div>
        ) : anns.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No announcements yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>{["Title","Type","Date","Status","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {anns.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3.5"><div className="text-sm font-semibold text-white">{a.title}</div><div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.content}</div></td>
                  <td className="px-4 py-3.5 capitalize"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${typeBadge[a.type]}`}>{a.type}</span></td>
                  <td className="px-4 py-3.5 text-sm text-gray-400">{a.published_at?.split("T")[0] ?? ""}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggle(a)} className="flex items-center gap-1.5 text-xs font-bold transition-colors">
                      {a.is_active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-gray-600" />}
                      <span className={a.is_active ? "text-green-400" : "text-gray-500"}>{a.is_active ? "Active" : "Inactive"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(a)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(a.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white flex items-center gap-2"><Bell className="w-4 h-4 text-amber-400" />{editing ? "Edit" : "Add"} Announcement</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Title</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Content</label><textarea rows={3} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Type</label>
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className={inputClass}>
                    {types.map((t) => <option key={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Date</label><input type="date" value={form.published_at} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))} className={inputClass} /></div>
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
            <h3 className="font-black text-white mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-400 mb-5">This will remove it from the website.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-700 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
