import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

declare global {
  // eslint-disable-next-line no-var
  var _supabaseServerClient: SupabaseClient | undefined;
}

export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase env vars are not configured");
  }

  if (!global._supabaseServerClient) {
    global._supabaseServerClient = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: { persistSession: false },
      },
    );
  }

  return global._supabaseServerClient;
}

export function dateToIsoString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
}
