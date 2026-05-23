"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Build-safe placeholders so static page generation doesn't crash when env
// vars aren't loaded. At runtime in the browser the real env vars are
// embedded by Next via NEXT_PUBLIC_*.
const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "veridian-auth",
    },
  });
  return _client;
}

// Proxy: defer construction until first property access (browser only)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
