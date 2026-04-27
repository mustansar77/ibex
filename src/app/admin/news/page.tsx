"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Newspaper, Eye, EyeOff, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface NewsItem { id: string; title: string; content: string; category: string; is_published: boolean; published_at: string; }
const cats = ["Results","Admissions","Scholarship","Achievement","Events","Facility","General"];
const inputClass = "w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-primary-500";
const empty = { title: "", content: "", category: "General", is_published: true, published_at: new Date().toISOString().split("T")[0] };

const mockNews: NewsItem[] = [
  { id: "1", title: "MDCAT 2024 Results — IBEX Students Shine", content: "97% of IBEX students qualified MDCAT 2024.", category: "Results", is_published: true, published_at: "2024-12-28" },
  { id: "2", title: "T Session Scholarship Applications Open", content: "Merit-based scholarships of 50%-100% now available.", category: "Scholarship", is_published: true, published_at: "2024-12-15" },
];

export default function NewsAdmin() {
  const [news, setNews]         = useState<NewsItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<NewsItem | null>(null);
  const [form, setForm]         = useState(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
      setNews(data || []);
    } else {
      setNews(mockNews);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (n: NewsItem) => {
    setForm({ title: n.title, content: n.content, category: n.category, is_published: n.is_published, published_at: n.published_at?.split("T")[0] ?? "" });
    setEditing(n); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString() };
    if (isSupabaseConfigured) {
      if (editing) await supabase.from("news").update(payload).eq("id", editing.id);
      else await supabase.from("news").insert([payload]);
      await fetchData();
    } else {
      if (editing) setNews((prev) => prev.map((n) => (n.id === editing.id ? { ...n, ...form } : n)));
      else setNews((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setSaving(false); setShowForm(false);
  };

  const togglePublish = async (n: NewsItem) => {
    if (isSupabaseConfigured) {
      await supabase.from("news").update({ is_published: !n.is_published }).eq("id", n.id);
    }
    setNews((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_published: !x.is_published } : x)));
  };

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from("news").delete().eq("id", id);
    setNews((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">News</h1>
          <p className="text-gray-400 text-sm mt-1">Manage news articles shown on the website</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Add News
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading…</div>
        ) : news.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No news articles yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>{["Title","Category","Date","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {news.map((n, i) => (
                  <motion.tr key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3.5"><div className="text-sm font-semibold text-white">{n.title}</div><div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.content}</div></td>
                    <td className="px-4 py-3.5"><span className="px-2.5 py-0.5 rounded-full bg-primary-900/40 text-primary-400 text-xs font-bold">{n.category}</span></td>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{n.published_at?.split("T")[0] ?? ""}</td>
                    <td className="px-4 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${n.is_published ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"}`}>{n.is_published ? "Published" : "Draft"}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => togglePublish(n)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title={n.is_published ? "Unpublish" : "Publish"}>{n.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                        <button onClick={() => openEdit(n)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(n.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white flex items-center gap-2"><Newspaper className="w-4 h-4 text-blue-400" />{editing ? "Edit" : "Add"} News</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Title</label><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Content</label><textarea rows={4} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className={`${inputClass} resize-none`} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={inputClass}>
                    {cats.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-bold text-gray-400 mb-1.5 block">Date</label><input type="date" value={form.published_at} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))} className="accent-primary-700 w-4 h-4" />
                <span className="text-sm text-gray-300 font-medium">Published (visible on website)</span>
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
            <h3 className="font-black text-white mb-2">Delete News?</h3>
            <p className="text-sm text-gray-400 mb-5">This will remove the article from the website.</p>
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
