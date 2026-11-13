import { FileText, ListChecks } from "lucide-react";
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
          <FileText className="size-3.5" aria-hidden />
          {num(lang, notes)}
        </span>
      )}
      {questions > 0 && (
        <span className="inline-flex items-center gap-1" title={countLabel(lang, "questions", questions)}>
          <ListChecks className="size-3.5" aria-hidden />
          {num(lang, questions)}
        </span>
      )}
    </span>
  );
}
