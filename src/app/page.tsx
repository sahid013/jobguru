import Link from "next/link";
import { buildTree, flattenTree, getSubjects, getTopics, getTopicStats, sumStats } from "@/lib/data";
import { countLabel, num } from "@/lib/i18n";

export default async function HomePage() {
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

  return (
    <div className="space-y-12">
      {/* ── Hero: what this is, and the one obvious thing to do first ── */}
      <section className="pt-4">
        <p className="text-sm font-medium text-brand">
          বিসিএস প্রিলিমিনারি · {countLabel("bn", "subjects", subjects.length)} · {num("bn", total)} নম্বর
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
          সিলেবাস ধরে ধরে, নিজের গতিতে প্রস্তুতি
        </h1>
        <p className="mt-3 max-w-2xl text-muted text-lg">
          প্রতিটি বিষয়ের অধ্যায়, নম্বর বণ্টন, প্রয়োজনীয় বই এবং নোট ও MCQ অনুশীলন — এক জায়গায়।
        </p>
        {startHere && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/subjects/${startHere.subject.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-brand-ink hover:opacity-90"
            >
              পড়া শুরু করুন
              <span aria-hidden>→</span>
            </Link>
            <Link href="#syllabus" className="rounded-lg border border-line px-5 py-3 font-medium hover:bg-surface-2">
              সব বিষয় দেখুন
            </Link>
          </div>
        )}
      </section>

      {/* ── How it works: three steps, no reading required ── */}
      <section aria-label="কীভাবে ব্যবহার করবেন" className="grid gap-3 sm:grid-cols-3">
        {[
          ["১", "বিষয় বাছুন", "নম্বর বণ্টন দেখে ঠিক করুন কোনটা আগে পড়বেন।"],
          ["২", "টপিক ধরে পড়ুন", "বাঁ পাশের তালিকা থেকে টপিক বেছে নোট পড়ুন।"],
          ["৩", "MCQ দিয়ে যাচাই করুন", "প্রতিটি টপিকের শেষে অনুশীলন করে ভুলগুলো দেখে নিন।"],
        ].map(([n, title, body]) => (
          <div key={n} className="flex gap-3 rounded-xl border border-line bg-surface p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand">
              {n}
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-0.5 text-sm text-muted">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Subjects: marks + what's actually available inside ── */}
      <section id="syllabus" className="scroll-mt-20">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold">বিষয় ও পূর্ণমান</h2>
          <p className="text-sm text-muted">মোট {num("bn", total)} নম্বর</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cards.map(({ subject: s, topicCount, notes, questions }) => {
            const empty = topicCount === 0;
            return (
              <li key={s.id}>
                <Link
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
                  <span className={`mt-auto text-sm font-medium ${empty ? "text-muted" : "text-brand"}`}>
                    {empty ? "সিলেবাস দেখুন" : "শুরু করুন"} <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
