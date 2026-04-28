"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Trophy, RefreshCw } from "lucide-react";

interface Position {
  id: string;
  name: string;
  marks_obtained: number;
  total_marks: number;
  board: string;
  test_type: string;
  year: string;
  rank: number;
  image_url: string;
}

const empty: Omit<Position, "id"> = { name: "", marks_obtained: 0, total_marks: 200, board: "", test_type: "MDCAT", year: new Date().getFullYear().toString(), rank: 1, image_url: "" };
const inputClass = "w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500";

async function dbCall(body: object) {
  const res = await fetch("/api/admin/db", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return res.json();
}

export default function TopPositionsAdmin() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Position | null>(null);
  const [form, setForm]         = useState<Omit<Position, "id">>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await dbCall({ table: "top_positions", op: "select", orderBy: { col: "year", asc: false } });
    setPositions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd  = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (p: Position) => {
    setForm({ name: p.name, marks_obtained: p.marks_obtained, total_marks: p.total_marks, board: p.board, test_type: p.test_type, year: p.year, rank: p.rank, image_url: p.image_url });
    setEditing(p); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    if (editing) await dbCall({ table: "top_positions", op: "update", id: editing.id, data: form });
    else await dbCall({ table: "top_positions", op: "insert", data: form });
    await fetchData();
    setSaving(false); setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await dbCall({ table: "top_positions", op: "delete", id });
    setPositions((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Top Positions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage position holders displayed on the website</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Add Position
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">Loading…</div>
        ) : positions.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">No positions yet. Click &quot;Add Position&quot; to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>{["Rank","Student","Marks","Board","Test","Year","Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {positions.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${p.rank === 1 ? "bg-amber-500" : p.rank === 2 ? "bg-gray-500" : p.rank === 3 ? "bg-amber-800" : "bg-primary-700"}`}>{p.rank}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {p.image_url && <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-full object-cover" />}
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-primary-400">{p.marks_obtained}/{p.total_marks}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-300">{p.board}</td>
                    <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded-full bg-primary-900/40 text-primary-400 text-xs font-bold">{p.test_type}</span></td>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{p.year}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-400" />{editing ? "Edit" : "Add"} Position</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Student Name</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Marks Obtained</label><input type="number" value={form.marks_obtained} onChange={(e) => setForm((p) => ({ ...p, marks_obtained: +e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Total Marks</label><input type="number" value={form.total_marks} onChange={(e) => setForm((p) => ({ ...p, total_marks: +e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Board</label><input value={form.board} onChange={(e) => setForm((p) => ({ ...p, board: e.target.value }))} placeholder="UHS / BWP Board" className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Test Type</label>
                <select value={form.test_type} onChange={(e) => setForm((p) => ({ ...p, test_type: e.target.value }))} className={inputClass}>
                  {["MDCAT","ECAT","NTS","GAT","Matric","Inter"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Year</label><input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Rank</label><input type="number" min={1} value={form.rank} onChange={(e) => setForm((p) => ({ ...p, rank: +e.target.value }))} className={inputClass} /></div>
              <div className="col-span-2"><label className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 block">Photo URL</label><input value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} placeholder="https://randomuser.me/api/portraits/men/1.jpg" className={inputClass} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
            </div>
          </motion.div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 w-80">
            <h3 className="font-black text-gray-900 dark:text-white mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-400 mb-5">Remove this position holder from the website?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
