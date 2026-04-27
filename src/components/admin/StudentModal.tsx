"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MapPin, BookOpen, GraduationCap } from "lucide-react";
import type { Application } from "@/lib/types";

const statusColors: Record<string, string> = {
  applied: "bg-blue-900/40 text-blue-400 border border-blue-800",
  enrolled: "bg-green-900/40 text-green-400 border border-green-800",
  rejected: "bg-red-900/40 text-red-400 border border-red-800",
};

interface Props {
  student: Application | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function StudentModal({ student, onClose, onStatusChange }: Props) {
  if (!student) return null;

  const Field = ({ label, value, icon: Icon }: { label: string; value: string | null | undefined; icon?: React.ElementType }) => (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />}
      <div>
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-white">{value || "—"}</div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 rounded-t-3xl">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-black">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-black text-white text-lg">{student.name}</h2>
                  <p className="text-sm text-gray-400">Application ID: {student.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[student.status]}`}>{student.status}</span>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Personal */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-3.5 h-3.5" />Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Father's Name" value={student.father_name} />
                <Field label="CNIC / B-Form" value={student.cnic} />
                <Field label="Email" value={student.email} icon={Mail} />
                <Field label="Phone" value={student.phone} icon={Phone} />
                <Field label="Emergency Contact" value={student.emergency_contact} icon={Phone} />
                <Field label="Address" value={student.address} icon={MapPin} />
              </div>
            </div>

            {/* Academic */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />Academic Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="School" value={student.school_name} />
                <Field label="College" value={student.college_name} />
                <Field label="Matric Marks" value={student.matric_marks ? `${student.matric_marks}/${student.matric_total}` : null} />
                <Field label="Intermediate Marks" value={student.inter_marks ? `${student.inter_marks}/${student.inter_total}` : null} />
              </div>
            </div>

            {/* Program */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" />Program Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Program" value={student.program === "entry-test" ? "Entry Test Preparation" : "Evening Coaching"} />
                <Field label="Test Type" value={student.test_type} />
                <Field label="Batch Preference" value={student.batch_preference} />
                <Field label="Applied On" value={new Date(student.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })} />
              </div>
            </div>

            {student.notes && (
              <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
                <div className="text-xs font-bold text-gray-500 mb-2">Admin Notes</div>
                <p className="text-sm text-gray-300">{student.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {onStatusChange && (
            <div className="p-6 border-t border-gray-800 flex flex-wrap gap-3">
              <div className="text-sm font-semibold text-gray-400 mr-2 self-center">Change Status:</div>
              {["applied", "enrolled", "rejected"].map((s) => (
                <button key={s} onClick={() => { onStatusChange(student.id, s); onClose(); }}
                  disabled={student.status === s}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all disabled:opacity-40 ${
                    s === "enrolled" ? "bg-green-700 hover:bg-green-600 text-white" :
                    s === "rejected" ? "bg-red-900 hover:bg-red-800 text-red-200" :
                    "bg-blue-900 hover:bg-blue-800 text-blue-200"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
