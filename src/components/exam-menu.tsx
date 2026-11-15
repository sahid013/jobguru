"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EXAMS } from "@/lib/exams";

/** Header dropdown listing every exam the site prepares for. */
export function ExamMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 font-semibold text-ink/80 transition-colors hover:text-brand aria-expanded:bg-brand-soft aria-expanded:text-brand"
      >
        পরীক্ষা
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul className="absolute -right-16 sm:right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)]rounded-2xl border border-line bg-surface p-1.5 shadow-[0_20px_40px_#034e3a26]">
          {EXAMS.map((exam) => (
            <li key={exam.slug}>
              <Link
                href={exam.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-ink transition-colors hover:bg-brand-soft hover:text-brand"
              >
                <span className="font-medium">{exam.title}</span>
                {!exam.live && (
                  <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-medium text-warn-ink">শীঘ্রই</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
