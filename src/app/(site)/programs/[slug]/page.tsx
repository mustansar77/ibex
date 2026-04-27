import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ProgramDetailPage from "@/components/sections/ProgramDetailPage";

type Params = Promise<{ slug: string }>;

export default async function DynamicProgramPage({ params }: { params: Params }) {
  const { slug } = await params;

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: program } = await db
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!program) notFound();

  return <ProgramDetailPage program={program!} />;
}
