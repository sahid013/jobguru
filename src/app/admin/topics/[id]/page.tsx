import { Check, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorClient } from "@/lib/auth";
import type { Note, Question, Subject, Topic } from "@/lib/types";
import { createQuestion, deleteNote, deleteQuestion, deleteTopic } from "../../actions";
import { ConfirmSubmit, Field, SubmitButton, inputClass } from "../../form-ui";

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ"];

export default async function AdminTopicPage({ params }: PageProps<"/admin/topics/[id]">) {
  const { id } = await params;
  const supabase = await getEditorClient();
  if (!supabase) return null;

  const { data: topic } = await supabase
    .from("topics")
    .select("*, subject:subjects(*)")
    .eq("id", id)
    .maybeSingle<Topic & { subject: Subject }>();
  if (!topic) notFound();

  const [{ data: notes }, { data: questions }] = await Promise.all([
    supabase.from("notes").select("*").eq("topic_id", id).order("sort_order"),
    supabase.from("questions").select("*").eq("topic_id", id).order("created_at", { ascending: false }),
  ]);
  const lang = topic.subject.lang;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-muted" lang={lang}>
          {topic.subject.title}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold" lang={lang}>
            {topic.title}
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href={`/subjects/${topic.subject.slug}/${topic.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm transition-colors hover:bg-surface-2"
            >
              সাইটে দেখুন
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <form action={deleteTopic}>
              <input type="hidden" name="id" value={topic.id} />
              <ConfirmSubmit message="এই টপিক এবং এর সব উপ-টপিক, নোট ও প্রশ্ন মুছে যাবে। নিশ্চিত?">
                টপিক মুছুন
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold">নোট</h2>
          <Link
            href={`/admin/notes/new?topic=${topic.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-brand-ink px-4 py-2 font-semibold transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden />
            নতুন নোট
          </Link>
        </div>
        {(notes as Note[]).length === 0 ? (
          <p className="text-muted">এখনো কোনো নোট নেই।</p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {(notes as Note[]).map((note) => (
              <li key={note.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <Link href={`/admin/notes/${note.id}`} className="hover:text-brand hover:underline" lang={lang}>
                  {note.title}
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  {!note.published && (
                    <span className="rounded-full bg-warn-bg text-warn-ink px-2 py-0.5 text-xs">খসড়া</span>
                  )}
                  <form action={deleteNote}>
                    <input type="hidden" name="id" value={note.id} />
                    <input type="hidden" name="topic_id" value={topic.id} />
                    <ConfirmSubmit message="নোটটি মুছে ফেলবেন?">মুছুন</ConfirmSubmit>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Questions ── */}
      <section>
        <h2 className="text-lg font-semibold mb-3">MCQ প্রশ্ন ({(questions as Question[]).length})</h2>

        <form action={createQuestion} className="rounded-xl border border-line bg-surface p-5 space-y-4">
          <input type="hidden" name="topic_id" value={topic.id} />
          <Field label="প্রশ্ন *">
            <textarea name="stem" rows={2} required className={inputClass} lang={lang} />
          </Field>
          <fieldset>
            <legend className="text-sm font-medium">অপশন — সঠিক উত্তরটি সিলেক্ট করুন *</legend>
            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              {OPTION_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_index"
                    value={i}
                    required
                    className="size-4 accent-brand"
                    aria-label={`${label} সঠিক`}
                  />
                  <input
                    name={`option_${i}`}
                    placeholder={label}
                    required={i < 2}
                    className={`${inputClass} mt-0`}
                    lang={lang}
                  />
                </div>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Field label="ব্যাখ্যা">
              <textarea name="explanation" rows={2} className={inputClass} lang={lang} />
            </Field>
            <Field label="উৎস" hint="যেমন: ৪৫তম বিসিএস">
              <input name="source" className={inputClass} />
            </Field>
          </div>
          <SubmitButton>প্রশ্ন যোগ করুন</SubmitButton>
        </form>

        <ol className="mt-4 space-y-3">
          {(questions as Question[]).map((q) => (
            <li key={q.id} className="rounded-xl border border-line bg-surface px-4 py-3" lang={lang}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{q.stem}</p>
                <form action={deleteQuestion} className="shrink-0">
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="topic_id" value={topic.id} />
                  <ConfirmSubmit message="প্রশ্নটি মুছে ফেলবেন?">মুছুন</ConfirmSubmit>
                </form>
              </div>
              <ul className="mt-1 grid gap-x-4 text-sm sm:grid-cols-2">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-1.5 ${i === q.correct_index ? "text-ok font-semibold" : "text-muted"}`}
                  >
                    {i === q.correct_index ? (
                      <Check className="mt-1 size-3.5 shrink-0" strokeWidth={3} aria-hidden />
                    ) : (
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-current" aria-hidden />
                    )}
                    {opt}
                  </li>
                ))}
              </ul>
              {q.source && <p className="mt-1 text-xs text-muted">{q.source}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
