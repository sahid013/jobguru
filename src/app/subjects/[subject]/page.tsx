import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { TopicList } from "@/components/topic-list";
import { Breadcrumbs, Callout, PageSkeleton } from "@/components/ui";
import { buildTree, flattenTree, getSubject, getSubjects, getTopics, getTopicStats, sumStats } from "@/lib/data";
import { countLabel, num, t } from "@/lib/i18n";

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/subjects/[subject]">): Promise<Metadata> {
  const subject = await getSubject((await params).subject);
  return { title: subject?.title };
}

export default function SubjectPage({ params }: PageProps<"/subjects/[subject]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SubjectContent params={params} />
    </Suspense>
  );
}

async function SubjectContent({ params }: Pick<PageProps<"/subjects/[subject]">, "params">) {
  const subject = await getSubject((await params).subject);
  if (!subject) notFound();

  const [topics, stats] = await Promise.all([getTopics(subject.id), getTopicStats()]);
  const tree = buildTree(topics);
  const first = flattenTree(tree)[0];
  const totals = sumStats(topics.map((x) => x.id), stats);
  const { lang } = subject;

  return (
    <div lang={lang}>
      <Breadcrumbs items={[{ href: "/", label: "সব বিষয়", lang: "bn" }, { label: subject.title }]} />

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-brand text-brand-ink">
          <h1 className="text-2xl font-bold">{subject.title}</h1>
          <span className="shrink-0 rounded-full bg-brand-ink text-brand px-3 py-0.5 font-semibold tabular-nums">
            {num(lang, subject.marks)} {t(lang, "marks")}
          </span>
        </div>

        {tree.length > 0 ? (
          <>
            {/* What's inside, and the one button to press first */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-5 py-3">
              <p className="text-sm text-muted">
                {countLabel(lang, "topics", topics.length)} ·{" "}
                {totals.notes + totals.questions > 0
                  ? `${countLabel(lang, "notes", totals.notes)} · ${countLabel(lang, "questions", totals.questions)}`
                  : t(lang, "contentComing")}
              </p>
              {first && (
                <Link
                  href={`/subjects/${subject.slug}/${first.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink hover:opacity-90"
                >
                  {t(lang, "start")} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
            <TopicList nodes={tree} lang={lang} subjectSlug={subject.slug} topics={topics} stats={stats} />
          </>
        ) : (
          <div className="p-5">
            <EmptyState
              title={t(lang, "noTopics")}
              body={t(lang, "noTopicsHint")}
              action={
                <Link href="/#syllabus" className="rounded-lg bg-brand px-4 py-2 font-semibold text-brand-ink hover:opacity-90">
                  {t(lang, "allSubjects")}
                </Link>
              }
            />
          </div>
        )}

        {subject.sources.length > 0 && (
          <section className="border-t border-line bg-surface-2 px-5 py-5">
            <h2 className="text-lg font-semibold text-brand">{t(lang, "sources")}</h2>
            {subject.sources.map((group, i) => (
              <div key={i} className="mt-3">
                {group.heading && <h3 className="font-semibold">{group.heading}</h3>}
                <ul className="mt-1 list-disc pl-6 space-y-1">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            {subject.source_note && <Callout label={t(lang, "note")}>{subject.source_note}</Callout>}
          </section>
        )}
      </div>
    </div>
  );
}
