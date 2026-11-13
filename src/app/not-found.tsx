import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl pt-10">
      <EmptyState
        icon="compass"
        title="পেজটি পাওয়া যায়নি"
        body="লিংকটি ভুল হতে পারে, অথবা পেজটি সরিয়ে ফেলা হয়েছে।"
        action={
          <Link href="/" className="rounded-lg bg-brand px-4 py-2 font-semibold text-brand-ink hover:opacity-90">
            সব বিষয় দেখুন
          </Link>
        }
      />
    </div>
  );
}
