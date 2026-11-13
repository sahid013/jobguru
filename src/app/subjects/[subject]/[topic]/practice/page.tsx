import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Quiz } from "@/components/quiz";
import { Breadcrumbs, PageSkeleton } from "@/components/ui";
import { descendantIds, getQuestions, getSubject, getTopics } from "@/lib/data";
import { t } from "@/lib/i18n";

type Props = PageProps<"/subjects/[subject]/[topic]/practice">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: s } = await params;
  const subject = await getSubject(s);
  return { title: subject ? `${t(subject.lang, "practice")} — ${subject.title}` : undefined };
}

export default function PracticePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PracticeContent params={params} />
    </Suspense>
  );
}

async function PracticeContent({ params }: Pick<Props, "params">) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const subject = await getSubject(subjectSlug);
  if (!subject) notFound();
  const topics = await getTopics(subject.id);
  const topic = topics.find((x) => x.slug === topicSlug);
  if (!topic) notFound();

  const questions = await getQuestions(descendantIds(topics, topic.id));
  const { lang } = subject;

  return (
    <div lang={lang} className="max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { href: "/", label: "সিলেবাস", lang: "bn" },
          { href: `/subjects/${subject.slug}`, label: subject.title },
          { href: `/subjects/${subject.slug}/${topic.slug}`, label: topic.title },
          { label: t(lang, "practice") },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">{topic.title}</h1>
      {questions.length === 0 ? (
        <p className="text-muted">{t(lang, "noQuestions")}</p>
      ) : (
        <Quiz questions={questions} lang={lang} />
      )}
    </div>
  );
}
