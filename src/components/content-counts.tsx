import { countLabel, num } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

/**
 * Compact "has content" hint: a note icon with a count and a question icon
 * with a count. Renders nothing when a topic has neither, so empty topics
 * are visibly different from ones with material.
 */
export function ContentCounts({
  lang,
  notes,
  questions,
  className = "",
}: {
  lang: Lang;
  notes: number;
  questions: number;
  className?: string;
}) {
  if (notes === 0 && questions === 0) return null;
  return (
    <span className={`inline-flex items-center gap-2.5 text-xs text-muted tabular-nums ${className}`}>
      {notes > 0 && (
        <span className="inline-flex items-center gap-1" title={countLabel(lang, "notes", notes)}>
          <NoteIcon />
          {num(lang, notes)}
        </span>
      )}
      {questions > 0 && (
        <span className="inline-flex items-center gap-1" title={countLabel(lang, "questions", questions)}>
          <QuizIcon />
          {num(lang, questions)}
        </span>
      )}
    </span>
  );
}

export function NoteIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <path d="M5 3.5h7l3 3v10H5v-13Z" strokeLinejoin="round" />
      <path d="M7.5 9h5M7.5 12h5" strokeLinecap="round" />
    </svg>
  );
}

export function QuizIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7" />
      <path d="m6.8 10.2 2.2 2.2 4.2-4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
