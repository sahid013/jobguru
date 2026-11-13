import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/**
 * Cookie-less client for public reads. Because it never touches cookies,
 * pages that use it stay statically cacheable (ISR) and scale cheaply.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
