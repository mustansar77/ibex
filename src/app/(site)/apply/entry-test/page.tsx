import { Metadata } from "next";
import ApplyForm from "@/components/sections/ApplyForm";

export const metadata: Metadata = {
  title: "Apply — Entry Test Preparation | IBEX Institute",
  description: "Apply for Entry Test Preparation at IBEX Institute Bahawalpur.",
};

export default function ApplyEntryTest() {
  return (
    <ApplyForm
      program="entry-test"
      programTitle="Entry Test Preparation"
      programIcon="🔬"
      programColor="from-primary-700 to-primary-900"
    />
  );
}
