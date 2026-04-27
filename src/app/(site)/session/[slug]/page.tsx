import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import SessionDetailPage from "@/components/sections/SessionDetailPage";

type Params = Promise<{ slug: string }>;

export default async function DynamicSessionPage({ params }: { params: Params }) {
  const { slug } = await params;

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: session } = await db
    .from("sessions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!session) notFound();

  return <SessionDetailPage session={session!} />;
}
