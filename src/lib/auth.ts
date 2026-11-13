import "server-only";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export type Role = "student" | "editor" | "admin";

/** Current user and role, or null when signed out. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role ?? "student") as Role;
  return { user, role, canEdit: role === "editor" || role === "admin" };
}

/** Throws unless the caller may edit content. Use at the top of every Server Action. */
export async function requireEditor() {
  const current = await getCurrentUser();
  if (!current?.canEdit) throw new Error("আপনার কন্টেন্ট এডিট করার অনুমতি নেই।");
  return current;
}

/**
 * Supabase client for admin pages, or null if the visitor may not edit.
 * Pages render in parallel with their layout, so each admin page checks for itself
 * (the layout shows the explanation).
 */
export async function getEditorClient() {
  if (!isSupabaseConfigured) return null;
  const current = await getCurrentUser();
  return current?.canEdit ? createClient() : null;
}
