import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ContentCounts } from "@/components/content-counts";
import { EmptyState } from "@/components/empty-state";
import { Markdown } from "@/components/markdown";
import { PressLink } from "@/components/motion";
import { Breadcrumbs, MarksBadge, PageSkeleton } from "@/components/ui";
import {
  ancestors,
  buildTree,
  countQuestions,
  descendantIds,
  flattenTree,
  getNotes,
  getSubject,
  getSubjects,
  getTopics,
  getTopicStats,
  sumStats,
} from "@/lib/data";
import { countLabel, t } from "@/lib/i18n";

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
  const href = (slug: string) => `/subjects/${subject.slug}/${slug}`;

  const ordered = flattenTree(buildTree(topics));
  const index = ordered.findIndex((x) => x.id === topic.id);
  const prev = ordered[index - 1];
  const next = ordered[index + 1];
  const children = ordered.filter((x) => x.parent_id === topic.id);

  const [notes, questionCount, stats] = await Promise.all([
    getNotes(topic.id),
    countQuestions(descendantIds(topics, topic.id)),
    getTopicStats(),
  ]);
  const isEmpty = notes.length === 0 && children.length === 0 && questionCount === 0;

  const practiceCard = questionCount > 0 && (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/30 bg-brand-soft px-5 py-4">
      <div>
        <p className="font-semibold">{t(lang, "practiceHint")}</p>
        <p className="text-sm text-muted">{countLabel(lang, "questions", questionCount)}</p>
      </div>
      <PressLink
        href={`${href(topic.slug)}/practice`}
        className="group inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 font-semibold text-brand-ink transition-opacity hover:opacity-90"
      >
        {t(lang, "practice")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </PressLink>
    </section>
  );

  return (
    <article lang={lang} className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { href: "/", label: "সব বিষয়", lang: "bn" },
            { href: `/subjects/${subject.slug}`, label: subject.title },
            ...ancestors(topics, topic).map((a) => ({ href: href(a.slug), label: a.title })),
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
      </div>

      {/* Questions but no notes yet: practice is the main thing to do here */}
      {notes.length === 0 && practiceCard}

      {children.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">{t(lang, "subtopics")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {children.map((c) => {
              const totals = sumStats(descendantIds(topics, c.id), stats);
              return (
                <li key={c.id}>
                  <Link
                    href={href(c.slug)}
                    className="group flex h-full flex-col rounded-lg border border-line bg-surface px-4 py-3 hover:border-brand"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-semibold group-hover:text-brand">{c.title}</span>
                      <ChevronRight
                        className="mt-0.5 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                        aria-hidden
                      />
                    </span>
                    {c.points.length > 0 && (
                      <span className="mt-1 block text-sm text-muted">{c.points.join(" · ")}</span>
                    )}
                    <ContentCounts lang={lang} notes={totals.notes} questions={totals.questions} className="mt-2" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {notes.length > 0 && (
        <section className="space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-line bg-surface px-5 sm:px-7 py-6">
              <h2 className="text-xl font-bold">{note.title}</h2>
              <Markdown>{note.body}</Markdown>
            </div>
          ))}
        </section>
      )}

      {/* Read first, then test */}
      {notes.length > 0 && practiceCard}

      {isEmpty && (
        <EmptyState
          title={t(lang, "emptyTopicTitle")}
          body={t(lang, "emptyTopicBody")}
          action={
            next && (
              <PressLink
                href={href(next.slug)}
                className="group inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-brand-ink transition-opacity hover:opacity-90"
              >
                {t(lang, "nextTopic")}: {next.title}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </PressLink>
            )
          }
        />
      )}

      {/* Keep moving through the syllabus without going back to the list */}
      <nav aria-label={t(lang, "topics")} className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <PressLink
            href={href(prev.slug)}
            className="group rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {t(lang, "prevTopic")}
            </span>
            <span className="mt-0.5 block font-semibold group-hover:text-brand">{prev.title}</span>
          </PressLink>
        ) : (
          <PressLink
            href={`/subjects/${subject.slug}`}
            className="group rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {t(lang, "backToOverview")}
            </span>
            <span className="mt-0.5 block font-semibold group-hover:text-brand">{subject.title}</span>
          </PressLink>
        )}
        {next && (
          <PressLink
            href={href(next.slug)}
            className="group rounded-lg border border-line bg-surface px-4 py-3 text-right transition-colors hover:border-brand sm:col-start-2"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              {t(lang, "nextTopic")}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-0.5 block font-semibold group-hover:text-brand">{next.title}</span>
          </PressLink>
        )}
      </nav>
    </article>
  );
}
