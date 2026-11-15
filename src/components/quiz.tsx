"use client";

import { ArrowRight, Check, CircleCheck, CircleX, Keyboard, Repeat, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { num, t } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import type { Lang, Question } from "@/lib/types";
import { PressButton, Stagger, StaggerItem } from "./motion";

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

  // Keyboard: 1–6 (or ১–৬) picks an option, Enter or the right arrow key moves on.
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
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[22px] border border-line bg-surface p-8 text-center shadow-[0_12px_32px_#034e3a0d]"
        >
          <p className="text-muted">{t(lang, "score")}</p>
          <p className="mt-2 text-5xl font-bold text-brand tabular-nums">
            {num(lang, score)} / {num(lang, answers.length)}
          </p>
          <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-2 to-brand"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
          </div>
          <p className="mt-2 text-sm text-muted tabular-nums">{num(lang, pct)}%</p>
          {wrong.length === 0 && (
            <p className="mt-4 inline-flex items-center gap-1.5 font-semibold text-ok">
              <CircleCheck className="size-5" aria-hidden />
              {t(lang, "allCorrect")}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {wrong.length > 0 && (
              <PressButton
                onClick={() => start(wrong.map((w) => w.question))}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-semibold text-brand-ink shadow-[0_8px_20px_#034e3a2e] transition-colors hover:bg-brand-2"
              >
                <Repeat className="size-4" aria-hidden />
                {t(lang, "retryWrong")} ({num(lang, wrong.length)})
              </PressButton>
            )}
            <PressButton
              onClick={() => start(questions)}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-colors ${
                wrong.length > 0 ? "border border-line hover:bg-surface-2" : "bg-brand text-brand-ink transition-colors hover:bg-brand-2"
              }`}
            >
              <RotateCcw className="size-4" aria-hidden />
              {t(lang, "restart")}
            </PressButton>
          </div>
        </motion.div>

        {wrong.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">{t(lang, "reviewWrong")}</h2>
            <Stagger className="space-y-3">
              {wrong.map(({ question, selected }, i) => (
                <StaggerItem key={question.id} className="rounded-xl border border-line bg-surface p-5">
                  <p className="font-semibold">
                    {num(lang, i + 1)}. {question.stem}
                  </p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex items-start gap-2 text-bad">
                      <X className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <dt className="shrink-0">{t(lang, "yourAnswer")}:</dt>
                      <dd>{question.options[selected]}</dd>
                    </div>
                    <div className="flex items-start gap-2 font-semibold text-ok">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <dt className="shrink-0">{t(lang, "correctAnswer")}:</dt>
                      <dd>{question.options[question.correct_index]}</dd>
                    </div>
                  </dl>
                  {question.explanation && (
                    <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                      <span className="font-semibold text-muted">{t(lang, "explanation")}: </span>
                      {question.explanation}
                    </p>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 shadow-[0_1px_2px_#034e3a0a,0_12px_32px_#034e3a0d] sm:p-8">
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          {t(lang, "question")} {num(lang, index + 1)} / {num(lang, order.length)}
        </span>
        {q.source && <span className="rounded-full bg-surface-2 px-2.5 py-0.5">{q.source}</span>}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-2 to-brand"
          initial={false}
          animate={{ width: `${((index + (answered ? 1 : 0)) / order.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${q.id}-${index}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
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
              // Wrong pick shakes once; the right answer gives a small pop.
              const feedback = !answered
                ? {}
                : isChosen && !isCorrect
                  ? { x: [0, -7, 7, -4, 4, 0] }
                  : isCorrect
                    ? { scale: [1, 1.015, 1] }
                    : {};
              return (
                <li key={i}>
                  <motion.button
                    onClick={() => choose(i)}
                    disabled={answered}
                    whileTap={answered ? undefined : { scale: 0.985 }}
                    animate={feedback}
                    transition={{ duration: 0.38 }}
                    className={`w-full flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${state}`}
                  >
                    <span className="grid place-items-center shrink-0 size-7 rounded-full bg-surface-2 text-sm font-semibold">
                      {OPTION_LABELS[lang][i]}
                    </span>
                    <span className="pt-0.5">{opt}</span>
                    <AnimatePresence>
                      {answered && (isCorrect || isChosen) && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`ml-auto shrink-0 grid size-6 place-items-center rounded-full ${
                            isCorrect ? "bg-ok text-white" : "bg-bad text-white"
                          }`}
                          aria-hidden
                        >
                          {isCorrect ? (
                            <Check className="size-4" strokeWidth={3} />
                          ) : (
                            <X className="size-4" strokeWidth={3} />
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {answered ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 space-y-4"
            aria-live="polite"
          >
            <p
              className={`inline-flex items-center gap-1.5 font-semibold ${
                selected === q.correct_index ? "text-ok" : "text-bad"
              }`}
            >
              {selected === q.correct_index ? (
                <CircleCheck className="size-5" aria-hidden />
              ) : (
                <CircleX className="size-5" aria-hidden />
              )}
              {selected === q.correct_index ? t(lang, "correct") : t(lang, "wrong")}
            </p>
            {q.explanation && (
              <div className="rounded-lg bg-surface-2 px-4 py-3">
                <p className="text-sm font-semibold text-muted">{t(lang, "explanation")}</p>
                <p className="mt-1">{q.explanation}</p>
              </div>
            )}
            <PressButton
              onClick={next}
              autoFocus
              className="group inline-flex items-center gap-2 rounded-full bg-brand text-brand-ink px-5 py-2.5 font-semibold shadow-[0_8px_20px_#034e3a2e] transition-colors hover:bg-brand-2"
            >
              {isLast ? t(lang, "finish") : t(lang, "next")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </PressButton>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5 hidden items-center gap-1.5 text-xs text-muted sm:inline-flex"
          >
            <Keyboard className="size-3.5" aria-hidden />
            {t(lang, "keyboardHint")}
          </motion.p>
        )}
      </AnimatePresence>
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
