import { Suspense } from "react";
import { SubjectSidebar } from "@/components/subject-sidebar";
import { buildTree, getSubject, getTopics, getTopicStats } from "@/lib/data";
import { examCrumb } from "@/lib/exams";
import { t } from "@/lib/i18n";

// Two columns: the topic tree on the left, the selected page (overview, topic, practice) on the right.
export default function SubjectLayout({ children, params }: LayoutProps<"/subjects/[subject]">) {
  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
      <Suspense fallback={<aside className="hidden lg:block h-96 rounded-xl bg-surface-2 animate-pulse" />}>
        <Sidebar params={params} />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

async function Sidebar({ params }: Pick<LayoutProps<"/subjects/[subject]">, "params">) {
  const subject = await getSubject((await params).subject);
  // The page renders the 404; the sidebar just stays empty.
  if (!subject) return <aside />;
  const [topics, stats] = await Promise.all([getTopics(subject.id), getTopicStats()]);

  return (
    <SubjectSidebar
      subjectSlug={subject.slug}
      subjectTitle={subject.title}
      examHref={examCrumb(subject.exam).href}
      lang={subject.lang}
      tree={buildTree(topics)}
      stats={stats}
      labels={{
        overview: t(subject.lang, "overview"),
        contents: t(subject.lang, "contents"),
        allSubjects: t(subject.lang, "allSubjects"),
      }}
    />
  );
}
