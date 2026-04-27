import { createClient } from "@supabase/supabase-js";

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL      || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Service-role key — exposed as NEXT_PUBLIC so it works in client components.
// Safe here: all content is public, and the admin panel is JWT-protected at middleware level.
const supabaseServiceKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||   // preferred (set this on Vercel)
  process.env.SUPABASE_SERVICE_ROLE_KEY             ||   // works server-side
  supabaseAnonKey;                                        // fallback

// Public client — used by public-facing pages (anon key, subject to RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — used by admin panel (service role key, bypasses RLS completely)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
