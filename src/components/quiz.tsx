"use client";

import { useEffect, useState } from "react";
import { num, t } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import type { Lang, Question } from "@/lib/types";

const OPTION_LABELS: Record<Lang, string[]> = {
  bn: ["ক", "খ", "গ", "ঘ", "ঙ", "চ"],
  en: ["A", "B", "C", "D", "E", "F"],
};
const BN_KEYS = "০১২৩৪৫৬৭৮৯";

type Answer = { question: Question; selected: number };

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
  const [answers, setAnswers] = useState<Answer[]>([]);

  const done = index >= order.length;
  const q = order[index];
  const answered = selected !== null;
  const isLast = index === order.length - 1;

  function choose(i: number) {
    if (answered || done) return;
    setSelected(i);
    setAnswers((a) => [...a, { question: q, selected: i }]);
    void recordAttempt(q.id, i, i === q.correct_index);
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  function start(list: Question[]) {
    setOrder(shuffle(list));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
  }

  // Keyboard: 1–6 (or ১–৬) picks an option, Enter / → moves on.
  useEffect(() => {
    if (done) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const digit = /^[1-6]$/.test(e.key) ? Number(e.key) : BN_KEYS.indexOf(e.key);
      if (digit >= 1 && digit <= q.options.length && !answered) {
        e.preventDefault();
        choose(digit - 1);
      } else if ((e.key === "Enter" || e.key === "ArrowRight") && answered) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, answered, q]);

  if (done) {
    const wrong = answers.filter((a) => a.selected !== a.question.correct_index);
    const score = answers.length - wrong.length;
    const pct = answers.length ? Math.round((score / answers.length) * 100) : 0;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="text-muted">{t(lang, "score")}</p>
          <p className="mt-2 text-5xl font-bold text-brand tabular-nums">
            {num(lang, score)} / {num(lang, answers.length)}
          </p>
          <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted tabular-nums">{num(lang, pct)}%</p>
          {wrong.length === 0 && <p className="mt-4 font-semibold text-ok">{t(lang, "allCorrect")}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {wrong.length > 0 && (
              <button
                onClick={() => start(wrong.map((w) => w.question))}
                className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-brand-ink hover:opacity-90"
              >
                {t(lang, "retryWrong")} ({num(lang, wrong.length)})
              </button>
            )}
            <button
              onClick={() => start(questions)}
              className={`rounded-lg px-5 py-2.5 font-semibold ${
                wrong.length > 0 ? "border border-line hover:bg-surface-2" : "bg-brand text-brand-ink hover:opacity-90"
              }`}
            >
              {t(lang, "restart")}
            </button>
          </div>
        </div>

        {wrong.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">{t(lang, "reviewWrong")}</h2>
            <ol className="space-y-3">
              {wrong.map(({ question, selected }, i) => (
                <li key={question.id} className="rounded-xl border border-line bg-surface p-5">
                  <p className="font-semibold">
                    {num(lang, i + 1)}. {question.stem}
                  </p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-bad">✗ {t(lang, "yourAnswer")}:</dt>
                      <dd className="text-bad">{question.options[selected]}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-ok">✓ {t(lang, "correctAnswer")}:</dt>
                      <dd className="font-semibold text-ok">{question.options[question.correct_index]}</dd>
                    </div>
                  </dl>
                  {question.explanation && (
                    <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                      <span className="font-semibold text-muted">{t(lang, "explanation")}: </span>
                      {question.explanation}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
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
                {answered && isCorrect && (
                  <span className="ml-auto pt-0.5 font-semibold text-ok" aria-hidden>
                    ✓
                  </span>
                )}
                {answered && isChosen && !isCorrect && (
                  <span className="ml-auto pt-0.5 font-semibold text-bad" aria-hidden>
                    ✗
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {answered ? (
        <div className="mt-5 space-y-4" aria-live="polite">
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
            autoFocus
            className="rounded-lg bg-brand text-brand-ink px-5 py-2.5 font-semibold hover:opacity-90"
          >
            {isLast ? t(lang, "finish") : t(lang, "next")} <span aria-hidden>→</span>
          </button>
        </div>
      ) : (
        <p className="mt-5 hidden text-xs text-muted sm:block">{t(lang, "keyboardHint")}</p>
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
