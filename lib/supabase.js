import { createClient } from "@supabase/supabase-js";

// Server-only: uses the secret key, which bypasses Row Level Security.
// Only import this from files under app/api/** — never from a "use client" file.
export const supabase = createClient(
  process.env.SUPABASE_URL?.replace(/\/$/, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
