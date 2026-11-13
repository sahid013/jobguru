"use client";

import { useFormStatus } from "react-dom";

export const inputClass =
  "mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 outline-none focus:border-brand";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-lg bg-brand text-brand-ink px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "…" : children}
    </button>
  );
}

/** A delete button that asks for confirmation first. */
export function ConfirmSubmit({ children, message }: { children: React.ReactNode; message: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className="rounded-md border border-bad/40 text-bad hover:bg-bad/10 px-2.5 py-1 text-sm disabled:opacity-60"
    >
      {children}
    </button>
  );
}
