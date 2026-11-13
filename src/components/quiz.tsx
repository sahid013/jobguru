"use client";

import { useState } from "react";
import { num, t } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import type { Lang, Question } from "@/lib/types";

const OPTION_LABELS: Record<Lang, string[]> = {
  bn: ["ক", "খ", "গ", "ঘ", "ঙ", "চ"],
  en: ["A", "B", "C", "D", "E", "F"],
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ questions, lang }: { questions: Question[]; lang: Lang }) {
  // First round keeps the authored order (so server and client render the same);
  // every restart shuffles.
  const [order, setOrder] = useState(questions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const done = index >= order.length;
  const q = order[index];
  const answered = selected !== null;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    const correct = i === q.correct_index;
    if (correct) setScore((s) => s + 1);
    void recordAttempt(q.id, i, correct);
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setOrder(shuffle(questions));
    setIndex(0);
    setSelected(null);
    setScore(0);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="text-muted">{t(lang, "score")}</p>
        <p className="mt-2 text-5xl font-bold text-brand tabular-nums">
          {num(lang, score)} / {num(lang, order.length)}
        </p>
        <button
          onClick={restart}
          className="mt-6 rounded-lg bg-brand text-brand-ink px-5 py-2.5 font-semibold hover:opacity-90"
        >
          {t(lang, "restart")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {t(lang, "question")} {num(lang, index + 1)} / {num(lang, order.length)}
        </span>
        {q.source && <span className="rounded-full bg-surface-2 px-2.5 py-0.5">{q.source}</span>}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${(index / order.length) * 100}%` }}
        />
      </div>

      <p className="mt-6 text-xl font-semibold leading-relaxed">{q.stem}</p>

      <ol className="mt-5 space-y-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct_index;
          const isChosen = i === selected;
          const state = !answered
            ? "border-line hover:border-brand hover:bg-brand-soft cursor-pointer"
            : isCorrect
              ? "border-ok bg-ok/10"
              : isChosen
                ? "border-bad bg-bad/10"
                : "border-line opacity-60";
          return (
            <li key={i}>
              <button
                onClick={() => choose(i)}
                disabled={answered}
                className={`w-full flex items-start gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors ${state}`}
              >
                <span className="grid place-items-center shrink-0 size-7 rounded-full bg-surface-2 text-sm font-semibold">
                  {OPTION_LABELS[lang][i]}
                </span>
                <span className="pt-0.5">{opt}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {answered && (
        <div className="mt-5 space-y-4">
          <p className={`font-semibold ${selected === q.correct_index ? "text-ok" : "text-bad"}`}>
            {selected === q.correct_index ? t(lang, "correct") : t(lang, "wrong")}
          </p>
          {q.explanation && (
            <div className="rounded-lg bg-surface-2 px-4 py-3">
              <p className="text-sm font-semibold text-muted">{t(lang, "explanation")}</p>
              <p className="mt-1">{q.explanation}</p>
            </div>
          )}
          <button
            onClick={next}
            className="rounded-lg bg-brand text-brand-ink px-5 py-2.5 font-semibold hover:opacity-90"
          >
            {t(lang, "next")} →
          </button>
        </div>
      )}
    </div>
  );
}

/** Saves the answer for signed-in students, for future progress tracking. */
async function recordAttempt(questionId: string, selectedIndex: number, isCorrect: boolean) {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;
  await supabase.from("attempts").insert({
    user_id: session.user.id,
    question_id: questionId,
    selected_index: selectedIndex,
    is_correct: isCorrect,
  });
}
