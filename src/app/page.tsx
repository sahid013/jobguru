import { ArrowRight, BookOpen, ListChecks, MousePointerClick } from "lucide-react";
import { Suspense, cache } from "react";
import { PressLink, Stagger, StaggerItem } from "@/components/motion";
import { buildTree, flattenTree, getSubjects, getTopics, getTopicStats, sumStats } from "@/lib/data";
import { countLabel, num } from "@/lib/i18n";

const loadHome = cache(async () => {
  const [subjects, stats] = await Promise.all([getSubjects(), getTopicStats()]);
  const cards = await Promise.all(
    subjects.map(async (s) => {
      const topics = await getTopics(s.id);
      const first = flattenTree(buildTree(topics))[0];
      return { subject: s, topicCount: topics.length, first, ...sumStats(topics.map((t) => t.id), stats) };
    }),
  );
  const total = subjects.reduce((sum, s) => sum + s.marks, 0);
  const startHere = cards.find((c) => c.topicCount > 0) ?? cards[0];
  return { subjects, cards, total, startHere };
});

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* ── Hero: what this is, and the one obvious thing to do first ── */}
      <section className="pt-4">
        <Suspense fallback={<p className="h-5 w-64 rounded bg-surface-2 animate-pulse" />}>
          <HeroMeta />
        </Suspense>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
          সিলেবাস ধরে ধরে, নিজের গতিতে প্রস্তুতি
        </h1>
        <p className="mt-3 max-w-2xl text-muted text-lg">
          প্রতিটি বিষয়ের অধ্যায়, নম্বর বণ্টন, প্রয়োজনীয় বই, নোট আর MCQ অনুশীলন এক জায়গায়।
        </p>
        <Suspense fallback={<div className="mt-6 h-12 w-72 rounded-lg bg-surface-2 animate-pulse" />}>
          <HeroActions />
        </Suspense>
      </section>

      {/* How it works, kept to one quiet line */}
      <ol
        aria-label="কীভাবে ব্যবহার করবেন"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-4 text-sm text-muted"
      >
        <li className="inline-flex items-center gap-2">
          <MousePointerClick className="size-4 text-brand" aria-hidden />
          বিষয় বাছুন
        </li>
        <li className="inline-flex items-center gap-2">
          <BookOpen className="size-4 text-brand" aria-hidden />
          টপিক ধরে নোট পড়ুন
        </li>
        <li className="inline-flex items-center gap-2">
          <ListChecks className="size-4 text-brand" aria-hidden />
          MCQ দিয়ে নিজেকে যাচাই করুন
        </li>
      </ol>

      {/* ── Subjects: marks + what's actually available inside ── */}
      <section id="syllabus" className="scroll-mt-20">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold">বিষয় ও পূর্ণমান</h2>
          <Suspense>
            <TotalMarks />
          </Suspense>
        </div>
        <Suspense fallback={<SubjectGridSkeleton />}>
          <SubjectGrid />
        </Suspense>
      </section>
    </div>
  );
}

async function HeroMeta() {
  const { subjects, total } = await loadHome();
  return (
    <p className="text-sm font-medium text-brand">
      বিসিএস প্রিলিমিনারি · {countLabel("bn", "subjects", subjects.length)} · {num("bn", total)} নম্বর
    </p>
  );
}

async function HeroActions() {
  const { startHere } = await loadHome();
  return (
    startHere && (
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <PressLink
          href={`/subjects/${startHere.subject.slug}`}
          className="group inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-brand-ink transition-opacity hover:opacity-90"
        >
          পড়া শুরু করুন
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </PressLink>
        <PressLink
          href="#syllabus"
          className="rounded-lg border border-line px-5 py-3 font-medium transition-colors hover:bg-surface-2"
        >
          সব বিষয় দেখুন
        </PressLink>
      </div>
    )
  );
}

async function TotalMarks() {
  const { total } = await loadHome();
  return <p className="text-sm text-muted">মোট {num("bn", total)} নম্বর</p>;
}

async function SubjectGrid() {
  const { cards } = await loadHome();
  return (
    <Stagger className="grid gap-3 sm:grid-cols-2">
      {cards.map(({ subject: s, topicCount, notes, questions }) => {
        const empty = topicCount === 0;
        return (
          <StaggerItem key={s.id}>
            <PressLink
              href={`/subjects/${s.slug}`}
              className={`group flex h-full flex-col gap-3 rounded-xl border bg-surface p-5 transition-colors hover:border-brand ${
                empty ? "border-dashed border-line" : "border-line"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-snug group-hover:text-brand" lang={s.lang}>
                  {s.title}
                </h3>
                <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-0.5 text-sm font-semibold tabular-nums">
                  {num("bn", s.marks)} নম্বর
                </span>
              </div>
              {empty ? (
                <p className="text-sm text-muted">
                  <span className="rounded-full bg-warn-bg px-2 py-0.5 text-xs font-medium text-warn-ink">
                    শীঘ্রই আসছে
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted">
                  {countLabel("bn", "topics", topicCount)} ·{" "}
                  {notes + questions > 0
                    ? `${countLabel("bn", "notes", notes)} · ${countLabel("bn", "questions", questions)}`
                    : "নোট ও প্রশ্ন যোগ হচ্ছে"}
                </p>
              )}
              <span
                className={`mt-auto inline-flex items-center gap-1 text-sm font-medium ${empty ? "text-muted" : "text-brand"}`}
              >
                {empty ? "সিলেবাস দেখুন" : "শুরু করুন"}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </PressLink>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

function SubjectGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-busy>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-36 rounded-xl border border-line bg-surface-2 animate-pulse" />
      ))}
    </div>
  );
}
