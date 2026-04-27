"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, RefreshCw, Filter } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Application } from "@/lib/types";
import StudentModal from "@/components/admin/StudentModal";

const statusColors: Record<string, string> = {
  applied: "bg-blue-900/40 text-blue-400",
  enrolled: "bg-green-900/40 text-green-400",
  rejected: "bg-red-900/40 text-red-400",
};

const mockData: Application[] = [
  { id: "abc123", created_at: new Date().toISOString(), name: "Ahmad Hassan", father_name: "Akbar Hassan", cnic: "31201-1234567-1", email: "ahmad@example.com", phone: "+92 300-1234567", address: "Main Road, Bahawalpur", program: "entry-test", test_type: "MDCAT", matric_marks: 980, matric_total: 1100, inter_marks: 920, inter_total: 1100, school_name: "Govt. High School BWP", college_name: "Govt. College BWP", batch_preference: "Morning (7AM-11AM)", emergency_contact: "+92 301-1234567", status: "applied", notes: null },
  { id: "def456", created_at: new Date(Date.now() - 86400000).toISOString(), name: "Fatima Zainab", father_name: "Zainab Malik", cnic: "31201-7654321-2", email: "fatima@example.com", phone: "+92 311-7654321", address: "Model Town, Bahawalpur", program: "evening-coaching", test_type: null, matric_marks: 950, matric_total: 1100, inter_marks: null, inter_total: 1100, school_name: "Govt. Girls School", college_name: null, batch_preference: "Evening Batch A (4-6PM)", emergency_contact: null, status: "enrolled", notes: null },
];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
      setApps(data || []);
    } else {
      setApps(mockData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id: string, status: string) => {
    if (isSupabaseConfigured) {
      await supabase.from("applications").update({ status }).eq("id", id);
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as Application["status"] } : a)));
  };

  const filtered = apps.filter((a) =>
    (statusFilter === "all" || a.status === statusFilter) &&
    (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Applications</h1>
          <p className="text-gray-400 text-sm mt-1">Manage student applications — {apps.length} total</p>
        </div>
        <button onClick={fetchApps} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          {["all", "applied", "enrolled", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${statusFilter === s ? "bg-primary-700 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {["Student", "Program", "Test", "Phone", "Applied On", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((app, i) => (
                  <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-700/30 text-primary-400 flex items-center justify-center font-black text-sm">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-300 capitalize">{app.program.replace("-", " ")}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-300">{app.test_type || "—"}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-300">{app.phone}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-400">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[app.status]}`}>{app.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(app)}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {app.status !== "enrolled" && (
                          <button onClick={() => updateStatus(app.id, "enrolled")}
                            className="px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/60 text-green-400 text-xs font-bold transition-colors">
                            Enroll
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentModal student={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />
    </div>
  );
}
