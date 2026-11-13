import type { Metadata } from "next";
import { ExternalLink, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { buildTree } from "@/lib/data";
import { getEditorClient } from "@/lib/auth";
import type { Subject, Topic, TopicNode } from "@/lib/types";
import { createTopic, refreshSite } from "./actions";
import { Field, SubmitButton, inputClass } from "./form-ui";

export const metadata: Metadata = { title: "কন্টেন্ট ড্যাশবোর্ড" };

export default async function AdminPage() {
  const supabase = await getEditorClient();
  if (!supabase) return null;
  const [{ data: subjects }, { data: topics }, { data: notes }, { data: questions }] = await Promise.all([
    supabase.from("subjects").select("*").order("sort_order"),
    supabase.from("topics").select("*").order("sort_order"),
    supabase.from("notes").select("topic_id"),
    supabase.from("questions").select("topic_id"),
  ]);

  if (!subjects?.length) {
    return (
      <p className="rounded-lg bg-warn-bg text-warn-ink px-4 py-3">
        ডাটাবেসে কোনো বিষয় নেই। <code>supabase/seed.sql</code> ফাইলটি SQL Editor-এ চালান।
      </p>
    );
  }

  const tally = (rows: { topic_id: string }[] | null) => {
    const m = new Map<string, number>();
    rows?.forEach((r) => m.set(r.topic_id, (m.get(r.topic_id) ?? 0) + 1));
    return m;
  };
  const counts = { notes: tally(notes), questions: tally(questions) };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-muted">
          একটি টপিক বেছে নিয়ে তাতে নোট ও MCQ যোগ করুন। নতুন টপিক বা উপ-টপিকও এখান থেকে যোগ করা যাবে।
        </p>
        <form action={refreshSite} className="shrink-0">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:bg-surface-2"
            title="SQL Editor দিয়ে যোগ করা কন্টেন্ট সাথে সাথে সাইটে দেখাতে"
          >
            <RefreshCw className="size-3.5" aria-hidden />
            সাইট রিফ্রেশ
          </button>
        </form>
      </div>
      {(subjects as Subject[]).map((subject) => {
        const subjectTopics = (topics as Topic[]).filter((t) => t.subject_id === subject.id);
        return (
          <section key={subject.id} className="rounded-xl border border-line bg-surface" lang={subject.lang}>
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-line">
              <h2 className="text-lg font-semibold">{subject.title}</h2>
              <Link
                href={`/subjects/${subject.slug}`}
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
                lang="bn"
              >
                সাইটে দেখুন
                <ExternalLink className="size-3.5" aria-hidden />
              </Link>
            </div>
            <div className="px-5 py-3">
              {subjectTopics.length === 0 ? (
                <p className="text-sm text-muted" lang="bn">এখনো কোনো টপিক নেই।</p>
              ) : (
                <TopicRows nodes={buildTree(subjectTopics)} counts={counts} />
              )}
              <details className="mt-3" lang="bn">
                <summary className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-brand">
                  <Plus className="size-4" aria-hidden />
                  নতুন টপিক যোগ করুন
                </summary>
                <form action={createTopic} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="subject_id" value={subject.id} />
                  <Field label="টাইটেল *">
                    <input name="title" required className={inputClass} lang={subject.lang} />
                  </Field>
                  <Field label="প্যারেন্ট টপিক" hint="খালি রাখলে মূল টপিক হবে">
                    <select name="parent_id" className={inputClass} lang={subject.lang}>
                      <option value="">— নেই —</option>
                      {subjectTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="নম্বর">
                    <input name="marks" type="number" min={0} className={inputClass} />
                  </Field>
                  <Field label="URL slug" hint="ইংরেজিতে, যেমন: physics-light (ঐচ্ছিক)">
                    <input name="slug" className={inputClass} lang="en" />
                  </Field>
                  <Field label="বিবরণ">
                    <textarea name="description" rows={2} className={inputClass} lang={subject.lang} />
                  </Field>
                  <Field label="পয়েন্টসমূহ" hint="প্রতি লাইনে একটি">
                    <textarea name="points" rows={2} className={inputClass} lang={subject.lang} />
                  </Field>
                  <div className="sm:col-span-2">
                    <SubmitButton>টপিক যোগ করুন</SubmitButton>
                  </div>
                </form>
              </details>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TopicRows({
  nodes,
  counts,
  depth = 0,
}: {
  nodes: TopicNode[];
  counts: { notes: Map<string, number>; questions: Map<string, number> };
  depth?: number;
}) {
  return (
    <ul className={depth ? "ml-5 border-l border-line pl-3" : ""}>
      {nodes.map((n) => (
        <li key={n.id}>
          <Link
            href={`/admin/topics/${n.id}`}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-surface-2"
          >
            <span>{n.title}</span>
            <span className="shrink-0 text-xs text-muted" lang="bn">
              নোট {counts.notes.get(n.id) ?? 0} · প্রশ্ন {counts.questions.get(n.id) ?? 0}
            </span>
          </Link>
          {n.children.length > 0 && <TopicRows nodes={n.children} counts={counts} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}
