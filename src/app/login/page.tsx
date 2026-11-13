import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "লগইন" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="max-w-sm mx-auto pt-6">
      <h1 className="text-2xl font-bold">লগইন</h1>
      <p className="mt-1 text-muted">কন্টেন্ট যোগ ও অগ্রগতি সংরক্ষণের জন্য লগইন করুন।</p>
      {isSupabaseConfigured ? (
        <Suspense>
          <LoginFormWithTarget searchParams={searchParams} />
        </Suspense>
      ) : (
        <p className="mt-6 rounded-lg bg-warn-bg text-warn-ink px-4 py-3">
          Supabase এখনো যুক্ত করা হয়নি। <code>.env.local</code> ফাইলে key বসান।
        </p>
      )}
    </div>
  );
}

async function LoginFormWithTarget({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/") ? next : "/admin";
  return <LoginForm next={target} />;
}
