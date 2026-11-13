import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "./actions";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Everything under /admin is per-user and reads cookies, so it renders at request time.
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <Notice title="Supabase যুক্ত করা হয়নি">
        <code>.env.local</code> ফাইলে <code>NEXT_PUBLIC_SUPABASE_URL</code> ও{" "}
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> বসিয়ে সার্ভার রিস্টার্ট করুন।
      </Notice>
    );
  }

  const current = await getCurrentUser();
  if (!current) redirect("/login?next=/admin");

  if (!current.canEdit) {
    return (
      <Notice title="এডিটরের অনুমতি প্রয়োজন">
        <p>আপনি লগইন করেছেন ({current.user.email}), কিন্তু কন্টেন্ট যোগ করার অনুমতি নেই।</p>
        <p className="mt-2">Supabase SQL Editor-এ এটি একবার চালান:</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-2 p-3 text-sm" lang="en">
          {`update public.profiles set role = 'admin'\nwhere id = '${current.user.id}';`}
        </pre>
      </Notice>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <Link href="/admin" className="text-xl font-bold">
          কন্টেন্ট ড্যাশবোর্ড
        </Link>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span lang="en">{current.user.email}</span>
          <button className="rounded-md border border-line px-3 py-1.5 hover:bg-surface-2">লগআউট</button>
        </form>
      </div>
      {children}
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-xl mx-auto rounded-xl border border-line bg-surface p-6">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  );
}
