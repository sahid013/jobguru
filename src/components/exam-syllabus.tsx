import { ArrowRight } from "lucide-react";
import { cache } from "react";
import { PressLink, Stagger, StaggerItem } from "@/components/motion";
import { buildTree, flattenTree, getSubjects, getTopics, getTopicStats, sumStats } from "@/lib/data";
import { countLabel, num } from "@/lib/i18n";

/** Every subject of an exam with its topic/note/question counts, plus the total marks. */
export const loadSyllabus = cache(async (exam: string) => {
  const [subjects, stats] = await Promise.all([getSubjects(exam), getTopicStats()]);
  const cards = await Promise.all(
    subjects.map(async (s) => {
      const topics = await getTopics(s.id);
      const first = flattenTree(buildTree(topics))[0];
      return { subject: s, topicCount: topics.length, first, ...sumStats(topics.map((t) => t.id), stats) };
    }),
  );
  const total = subjects.reduce((sum, s) => sum + s.marks, 0);
  const topicCount = cards.reduce((sum, c) => sum + c.topicCount, 0);
  const startHere = cards.find((c) => c.topicCount > 0) ?? cards[0];
  return { subjects, cards, total, topicCount, startHere };
});

export async function SubjectGrid({ exam }: { exam: string }) {
  const { cards } = await loadSyllabus(exam);
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ subject: s, topicCount, notes, questions }, i) => {
        const empty = topicCount === 0;
        return (
          <StaggerItem key={s.id}>
            <PressLink
              href={`/subjects/${s.slug}`}
              className={`lift group flex h-full flex-col overflow-hidden rounded-[22px] border bg-[linear-gradient(180deg,#ffffff0f,#ffffff05)] p-6 pb-5 hover:shadow-[0_24px_48px_#00000047] ${
                empty ? "border-dashed border-mint/20" : "border-mint/20 hover:border-mint/40"
              }`}
            >
              <span
                aria-hidden
                className="font-display pointer-events-none absolute top-2 right-5 select-none text-6xl leading-none text-mint/10 transition-colors group-hover:text-mint/20"
              >
                {num("bn", String(i + 1).padStart(2, "0"))}
              </span>
              <h3 className="font-display relative pr-14 text-2xl leading-snug text-white" lang={s.lang}>
                {s.title}
              </h3>
              <p className="relative mt-3 flex-1 text-[#d6e6df]">
                {empty
                  ? "সিলেবাস দেখুন—টপিক শীঘ্রই আসছে"
                  : [
                      countLabel("bn", "topics", topicCount),
                      ...(notes + questions > 0
                        ? [notes > 0 && countLabel("bn", "notes", notes), questions > 0 && countLabel("bn", "questions", questions)]
                        : ["নোট ও প্রশ্ন যোগ হচ্ছে"]),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
              <span className="relative mt-5 flex items-center justify-between gap-3 border-t border-mint/15 pt-4">
                <span className="font-semibold text-[#9fe0c4]">
                  {s.marks > 0 ? `${num("bn", s.marks)} নম্বর` : "সমাধানসহ প্রশ্ন"}
                  {empty && (
                    <span className="ml-2 rounded-full bg-[#f2c94c]/15 px-2 py-0.5 text-xs font-medium text-[#f2c94c]">
                      শীঘ্রই
                    </span>
                  )}
                </span>
                <span className="grid size-9 place-items-center rounded-full border border-mint/30 text-mint transition-colors group-hover:border-mint group-hover:bg-mint group-hover:text-deep">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </PressLink>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

export function SubjectGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-44 rounded-[22px] border border-mint/15 bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
