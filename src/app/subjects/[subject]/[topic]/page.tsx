import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { Breadcrumbs, MarksBadge, PageSkeleton } from "@/components/ui";
import {
  ancestors,
  countQuestions,
  descendantIds,
  getNotes,
  getSubject,
  getSubjects,
  getTopics,
} from "@/lib/data";
import { num, t } from "@/lib/i18n";

export async function generateStaticParams() {
  const subjects = await getSubjects();
  const all = await Promise.all(
    subjects.map(async (s) =>
      (await getTopics(s.id)).map((topic) => ({ subject: s.slug, topic: topic.slug })),
    ),
  );
  return all.flat();
}

type Props = PageProps<"/subjects/[subject]/[topic]">;

async function load(params: Props["params"]) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const subject = await getSubject(subjectSlug);
  if (!subject) return null;
  const topics = await getTopics(subject.id);
  const topic = topics.find((x) => x.slug === topicSlug);
  if (!topic) return null;
  return { subject, topics, topic };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  return { title: data ? `${data.topic.title} — ${data.subject.title}` : undefined };
}

export default function TopicPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TopicContent params={params} />
    </Suspense>
  );
}

async function TopicContent({ params }: Pick<Props, "params">) {
  const data = await load(params);
  if (!data) notFound();
  const { subject, topics, topic } = data;
  const { lang } = subject;

  const children = topics
    .filter((x) => x.parent_id === topic.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const [notes, questionCount] = await Promise.all([
    getNotes(topic.id),
    countQuestions(descendantIds(topics, topic.id)),
  ]);

  return (
    <article lang={lang}>
      <Breadcrumbs
        items={[
          { href: "/", label: "সিলেবাস", lang: "bn" },
          { href: `/subjects/${subject.slug}`, label: subject.title },
          ...ancestors(topics, topic).map((a) => ({
            href: `/subjects/${subject.slug}/${a.slug}`,
            label: a.title,
          })),
          { label: topic.title },
        ]}
      />

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight">{topic.title}</h1>
          {topic.description && <p className="mt-2 text-lg text-muted">{topic.description}</p>}
          {topic.points.length > 0 && (
            <ul className="mt-2 list-[circle] pl-6 text-muted space-y-1">
              {topic.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
        {topic.marks != null && <MarksBadge lang={lang} marks={topic.marks} solid />}
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {questionCount > 0 ? (
          <Link
            href={`/subjects/${subject.slug}/${topic.slug}/practice`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand text-brand-ink px-4 py-2.5 font-semibold hover:opacity-90"
          >
            {t(lang, "practice")}
            <span className="rounded-full bg-brand-ink/20 px-2 text-sm">
              {num(lang, questionCount)}
              {t(lang, "questions")}
            </span>
          </Link>
        ) : (
          <span className="text-sm text-muted">{t(lang, "noQuestions")}</span>
        )}
      </div>

      {children.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t(lang, "subtopics")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {children.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/subjects/${subject.slug}/${c.slug}`}
                  className="block h-full rounded-lg border border-line bg-surface px-4 py-3 hover:border-brand"
                >
                  <span className="font-semibold">{c.title}</span>
                  {c.points.length > 0 && (
                    <span className="mt-1 block text-sm text-muted">{c.points.join(" · ")}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">{t(lang, "notes")}</h2>
        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-4 py-6 text-muted">
            {t(lang, "noNotes")}
          </p>
        ) : (
          <div className="space-y-6">
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-line bg-surface px-5 sm:px-7 py-6">
                <h3 className="text-xl font-bold">{note.title}</h3>
                <Markdown>{note.body}</Markdown>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
