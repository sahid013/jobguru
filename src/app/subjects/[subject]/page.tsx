import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { PressLink } from "@/components/motion";
import { TopicList } from "@/components/topic-list";
import { examCrumb } from "@/lib/exams";
import { Breadcrumbs, Callout, PageSkeleton } from "@/components/ui";
import { buildTree, flattenTree, getSubject, getTopics, getTopicStats, sumStats } from "@/lib/data";
import { countLabel, num, t } from "@/lib/i18n";

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
      <Breadcrumbs items={[examCrumb(subject.exam), { label: subject.title }]} />

      <div className="rounded-[22px] border border-line bg-surface overflow-hidden shadow-[0_1px_2px_#034e3a0a]">
        <div className="panel-deep px-6 py-8 sm:px-8">
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-mint">{t(lang, "overview")}</p>
              <h1 className="font-display mt-1 text-3xl sm:text-4xl">{subject.title}</h1>
            </div>
            {subject.marks > 0 && (
              <span className="shrink-0 rounded-full border border-[#f2c94c]/30 bg-[#f2c94c]/15 px-4 py-1 font-semibold text-[#f2c94c] tabular-nums">
                {num(lang, subject.marks)} {t(lang, "marks")}
              </span>
            )}
          </div>
        </div>

        {tree.length > 0 ? (
          <>
            {/* What's inside, and the one button to press first */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-gold-soft/50 px-5 py-3.5">
              <p className="text-sm text-muted">
                {countLabel(lang, "topics", topics.length)} ·{" "}
                {totals.notes + totals.questions > 0
                  ? `${countLabel(lang, "notes", totals.notes)} · ${countLabel(lang, "questions", totals.questions)}`
                  : t(lang, "contentComing")}
              </p>
              {first && (
                <PressLink
                  href={`/subjects/${subject.slug}/${first.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-ink shadow-[0_8px_20px_#034e3a2e] transition-colors hover:bg-brand-2"
                >
                  {t(lang, "start")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </PressLink>
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
                <Link href={examCrumb(subject.exam).href} className="rounded-full bg-brand px-4 py-2 font-semibold text-brand-ink transition-colors hover:bg-brand-2">
                  {t(lang, "allSubjects")}
                </Link>
              }
            />
          </div>
        )}

        {subject.sources.length > 0 && (
          <section className="border-t border-line bg-surface-2 px-5 py-5">
            <h2 className="font-display text-xl text-heading">{t(lang, "sources")}</h2>
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
