import { Metadata } from "next";
import ApplyForm from "@/components/sections/ApplyForm";

export const metadata: Metadata = {
  title: "Apply — Evening Coaching | IBEX Institute",
  description: "Apply for Evening Coaching at IBEX Institute Bahawalpur.",
};

export default function ApplyEveningCoaching() {
  return (
    <ApplyForm
      program="evening-coaching"
      programTitle="Evening Coaching"
      programIcon="🌙"
      programColor="from-purple-700 to-purple-900"
    />
  );
}
