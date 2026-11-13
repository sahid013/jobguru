import Link from "next/link";
import { num } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function MarksBadge({ lang, marks, solid }: { lang: Lang; marks: number; solid?: boolean }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center min-w-10 h-7 px-2.5 rounded-full text-sm font-semibold tabular-nums ${
        solid ? "bg-brand text-brand-ink" : "bg-surface-2 text-ink border border-line"
      }`}
    >
      {num(lang, marks)}
    </span>
  );
}

export type Crumb = { href?: string; label: string; lang?: Lang };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted flex flex-wrap items-center gap-1.5">
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5" lang={c.lang}>
          {i > 0 && <span aria-hidden>›</span>}
          {c.href ? (
            <Link href={c.href} className="hover:text-brand hover:underline">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg bg-warn-bg text-warn-ink px-4 py-3 text-[0.95rem]">
      <strong className="font-semibold">{label}:</strong> {children}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy>
      <div className="h-4 w-48 rounded bg-surface-2" />
      <div className="h-9 w-2/3 rounded bg-surface-2" />
      <div className="h-48 rounded-xl bg-surface-2" />
    </div>
  );
}
