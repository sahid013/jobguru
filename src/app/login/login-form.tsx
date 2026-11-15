"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setPending(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { data, error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/auth/callback?next=${next}` },
          });

    setPending(false);
    if (error) return setError(error.message);
    if (mode === "signup" && !data.session) {
      return setMessage("ইমেইলে একটি কনফার্মেশন লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে লগইন করুন।");
    }
    router.push(next);
    router.refresh();
  }

  const input =
    "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2.5 outline-none focus:border-brand";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">ইমেইল</span>
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">পাসওয়ার্ড</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          className={input}
        />
      </label>
      {error && <p className="text-sm text-bad">{error}</p>}
      {message && <p className="text-sm text-ok">{message}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-brand text-brand-ink py-2.5 font-semibold transition-colors hover:bg-brand-2 disabled:opacity-60"
      >
        {pending ? "অপেক্ষা করুন…" : mode === "signin" ? "লগইন" : "অ্যাকাউন্ট খুলুন"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="w-full text-sm text-muted hover:text-brand"
      >
        {mode === "signin" ? "নতুন? অ্যাকাউন্ট খুলুন" : "আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন"}
      </button>
    </form>
  );
}
