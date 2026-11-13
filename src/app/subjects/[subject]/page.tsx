import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TopicList } from "@/components/topic-list";
import { Breadcrumbs, Callout, PageSkeleton } from "@/components/ui";
import { buildTree, getSubject, getSubjects, getTopics } from "@/lib/data";
import { num, t } from "@/lib/i18n";

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

  const tree = buildTree(await getTopics(subject.id));
  const { lang } = subject;

  return (
    <div lang={lang}>
      <Breadcrumbs items={[{ href: "/", label: "সিলেবাস", lang: "bn" }, { label: subject.title }]} />

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-brand text-brand-ink">
          <h1 className="text-2xl font-bold">{subject.title}</h1>
          <span
            className="shrink-0 rounded-full bg-brand-ink text-brand px-3 py-0.5 font-semibold tabular-nums"
            title={t(lang, "marks")}
          >
            {num(lang, subject.marks)}
          </span>
        </div>

        {tree.length > 0 ? (
          <TopicList nodes={tree} lang={lang} subjectSlug={subject.slug} />
        ) : (
          <p className="px-5 py-8 text-muted">{t(lang, "noTopics")}</p>
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
