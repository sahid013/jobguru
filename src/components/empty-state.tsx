import { BookOpen, Compass } from "lucide-react";
import type { ReactNode } from "react";

const ICONS = { book: BookOpen, compass: Compass };

/** A friendly "nothing here yet" panel: what's missing, why, and what to do instead. */
export function EmptyState({
  icon = "book",
  title,
  body,
  action,
}: {
  icon?: keyof typeof ICONS;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  const Icon = ICONS[icon];
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {body && <p className="mx-auto mt-1 max-w-md text-muted">{body}</p>}
      {action && <div className="mt-5 flex justify-center gap-3">{action}</div>}
    </div>
  );
}
