export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until both env vars are set; the site then falls back to the bundled syllabus. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
