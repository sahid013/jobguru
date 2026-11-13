import type { ReactNode } from "react";

/** A friendly "nothing here yet" panel: what's missing, why, and what to do instead. */
export function EmptyState({
  icon = "book",
  title,
  body,
  action,
}: {
  icon?: "book" | "compass";
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
        {icon === "book" ? <BookIcon /> : <CompassIcon />}
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {body && <p className="mx-auto mt-1 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-5 flex justify-center gap-3">{action}</div>}
    </div>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M9 8h7M9 11.5h5" strokeLinecap="round" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" strokeLinejoin="round" />
    </svg>
  );
}
