"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2, RefreshCw } from "lucide-react";
import { supabaseAdmin as supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Application } from "@/lib/types";
import StudentModal from "@/components/admin/StudentModal";

const mockEnrolled: Application[] = [
  { id: "def456", created_at: new Date(Date.now() - 86400000).toISOString(), name: "Fatima Zainab", father_name: "Zainab Malik", cnic: "31201-7654321-2", email: "fatima@example.com", phone: "+92 311-7654321", address: "Model Town, Bahawalpur", program: "evening-coaching", test_type: null, matric_marks: 950, matric_total: 1100, inter_marks: null, inter_total: 1100, school_name: "Govt. Girls School", college_name: null, batch_preference: "Evening Batch A (4-6PM)", emergency_contact: null, status: "enrolled", notes: null },
];

export default function EnrolledPage() {
  const [students, setStudents] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchEnrolled = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("applications").select("*").eq("status", "enrolled").order("created_at", { ascending: false });
      setStudents(data || []);
    } else {
      setStudents(mockEnrolled);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEnrolled(); }, []);

  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from("applications").delete().eq("id", id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const filtered = students.filter((s) => search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Enrolled Students</h1>
          <p className="text-gray-400 text-sm mt-1">{students.length} students currently enrolled</p>
        </div>
        <button onClick={fetchEnrolled} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No enrolled students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {["Student", "Program", "Batch", "Phone", "Enrolled On", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-700/30 text-green-400 flex items-center justify-center font-black text-sm">{s.name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{s.name}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-300 capitalize">{s.program.replace("-", " ")}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-300">{s.batch_preference || "—"}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-300">{s.phone}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(s)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(s.id)} className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-80">
            <h3 className="font-black text-white mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-400 mb-5">This will permanently remove the student record. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      <StudentModal student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
