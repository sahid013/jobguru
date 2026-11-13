"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type State =
  | { status: "loading" }
  | { status: "out" }
  | { status: "in"; email: string; canEdit: boolean };

/**
 * Header menu that adapts to who is visiting. Students see "লগইন"; signed-in
 * users see "লগআউট"; only editors see the content dashboard link.
 * Runs on the client so the rest of the page stays static and cacheable.
 */
export function AuthMenu() {
  const router = useRouter();
  const [state, setState] = useState<State>(
    isSupabaseConfigured ? { status: "loading" } : { status: "out" },
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) setState({ status: "out" });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!cancelled) {
        setState({
          status: "in",
          email: session.user.email ?? "",
          canEdit: profile?.role === "editor" || profile?.role === "admin",
        });
      }
    }

    load();
    // Deferred so we never await Supabase inside its own auth callback.
    const { data: sub } = supabase.auth.onAuthStateChange(() => setTimeout(load, 0));
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await createClient().auth.signOut();
    setState({ status: "out" });
    router.refresh();
  }

  const item = "px-3 py-2 rounded-md hover:bg-surface-2";

  if (state.status === "loading") return <span className="inline-block w-14 h-9" aria-hidden />;

  if (state.status === "out") {
    return (
      <Link href="/login" className={item}>
        লগইন
      </Link>
    );
  }

  return (
    <>
      {state.canEdit && (
        <Link href="/admin" className="px-3 py-2 rounded-md bg-brand-soft text-brand font-medium hover:opacity-90">
          কন্টেন্ট যোগ
        </Link>
      )}
      <button onClick={signOut} title={state.email} className={`${item} text-muted`}>
        লগআউট
      </button>
    </>
  );
}
