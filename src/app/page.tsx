import { ArrowRight, BookOpen, ListChecks, MousePointerClick } from "lucide-react";
import { Suspense } from "react";
import { loadSyllabus } from "@/components/exam-syllabus";
import { PressLink, Stagger, StaggerItem } from "@/components/motion";
import { EXAMS } from "@/lib/exams";
import { countLabel, num } from "@/lib/i18n";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero: what this is, and the one obvious thing to do first ── */}
      <section className="full-bleed relative -mt-8 overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24">
        <div className="glow glow-green -left-32 top-10 size-[420px]" aria-hidden />
        <div className="glow glow-gold -right-20 top-[10%] size-[560px]" aria-hidden />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-brand-2/20 bg-brand-2/10 px-4 py-1.5 text-[0.95rem] font-semibold text-brand">
              <span className="pill-dot" aria-hidden />
              চাকরির পরীক্ষা · {num("bn", EXAMS.length)}টি পরীক্ষা · নোট ও MCQ
            </p>
            <h1 className="font-display mt-6 text-4xl leading-tight text-heading sm:text-5xl sm:leading-[1.2] text-balance">
              সিলেবাস ধরে ধরে,{" "}
              <span className="relative inline-block pb-3 text-brand-2">
                নিজের গতিতে
                <svg
                  className="absolute inset-x-0 bottom-0 h-3 w-full overflow-visible"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M3 9c40-6 90-8 194-3"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              প্রস্তুতি
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              বিসিএস, ব্যাংক, গ্যাস ফিল্ডসহ চাকরির পরীক্ষার সিলেবাস, নম্বর বণ্টন,{" "}
              <em className="not-italic font-semibold text-brand">নোট আর MCQ অনুশীলন</em> এক জায়গায়।
            </p>
            <HeroActions />
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── How it works: three steps ── */}
      <section aria-labelledby="how" className="-mt-6 pb-16">
        <div className="text-center">
          <p className="font-semibold text-brand">কীভাবে পড়বেন</p>
          <h2 id="how" className="font-display mt-2 text-3xl text-heading">তিন ধাপে প্রতিদিনের প্রস্তুতি</h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc, panel }, i) => (
            <li key={title} className="lift overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_1px_2px_#034e3a0a]">
              <div className={`flex min-h-24 items-end justify-between gap-3 px-5 pt-4 pb-3 ${panel}`}>
                <span className="self-start rounded-full bg-black/5 px-3 py-0.5 text-sm font-bold dark:bg-white/10">
                  ধাপ {num("bn", i + 1)}
                </span>
                <Icon className="size-10 opacity-90" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="px-5 pt-4 pb-5">
                <h3 className="font-display text-xl text-heading">{title}</h3>
                <p className="mt-1.5 text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Exams: BCS is live, the rest are on the way ── */}
      <section id="exams" className="full-bleed panel-deep -mb-16 scroll-mt-16 px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-lg font-bold text-[#f2c94c]">পরীক্ষা</p>
            <h2 className="font-display mt-1 text-3xl sm:text-4xl">কোন পরীক্ষার প্রস্তুতি নিচ্ছেন?</h2>
            <p className="mt-3 text-[#d6e6df]">পরীক্ষা বাছুন—তারপর বিষয় ধরে নোট পড়ুন আর MCQ দিন</p>
          </div>
          <ExamGrid />
        </div>
      </section>
    </div>
  );
}

const STEPS = [
  {
    icon: MousePointerClick,
    title: "পরীক্ষা ও বিষয় বাছুন",
    desc: "আপনার পরীক্ষা বেছে নিন, তারপর নম্বর বণ্টন দেখে কোন বিষয় আগে পড়বেন ঠিক করুন।",
    panel: "bg-gradient-to-br from-[#e6f6ee] to-[#c5ebd9] text-[#034e3a] dark:from-[#12302a] dark:to-[#0f2620] dark:text-mint",
  },
  {
    icon: BookOpen,
    title: "টপিক ধরে নোট পড়ুন",
    desc: "সিলেবাসের ক্রম ধরে সাজানো নোট—মনে রাখার কৌশল আর একনজরে সারণিসহ।",
    panel: "bg-gradient-to-br from-[#a8e3ca] to-mint text-[#063d2f]",
  },
  {
    icon: ListChecks,
    title: "MCQ দিয়ে যাচাই করুন",
    desc: "প্রতিটি টপিকের শেষে অনুশীলন; ভুলগুলো আলাদা করে আবার দিন।",
    panel: "bg-gradient-to-br from-brand-2 to-brand text-white",
  },
];

function HeroActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3.5">
      <PressLink
        href="/exams/bcs"
        className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[1.05rem] font-semibold text-brand-ink shadow-[0_10px_24px_#034e3a38] transition-colors hover:bg-brand-2"
      >
        বিসিএস প্রস্তুতি শুরু করুন
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </PressLink>
      <PressLink
        href="#exams"
        className="rounded-full border-[1.5px] border-brand/20 bg-surface px-7 py-3.5 text-[1.05rem] font-semibold text-brand transition-colors hover:border-brand-2 hover:text-brand-2"
      >
        সব পরীক্ষা দেখুন
      </PressLink>
    </div>
  );
}

/** Decorative preview of a practice question, on a tilted green frame. */
function HeroVisual() {
  const options = ["অ্যান কার্সন", "নাভি পিল্লাই", "হান কাং", "জন ফসে"];
  return (
    <div aria-hidden className="relative hidden pr-4 pb-16 pl-8 lg:block">
      <div className="absolute inset-0 bottom-12 left-10 rotate-3 rounded-[32px] bg-gradient-to-br from-brand-2 to-deep" />
      <div className="relative rounded-[26px] border-[6px] border-surface bg-surface p-6 shadow-[0_30px_60px_#034e3a40]">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>প্রশ্ন ৩ / ২০</span>
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-medium text-warn-ink">নোবেল ২০২৬</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-brand-2 to-brand" />
        </div>
        <p className="mt-5 text-lg font-semibold text-heading">২০২৬ সালে নোবেল শান্তি পুরস্কার পেয়েছেন কে?</p>
        <ol className="mt-4 space-y-2">
          {options.map((o, i) => (
            <li
              key={o}
              className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 ${
                i === 1 ? "border-ok bg-ok/10 font-semibold" : "border-line"
              }`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                  i === 1 ? "bg-ok text-white" : "bg-surface-2"
                }`}
              >
                {["ক", "খ", "গ", "ঘ"][i]}
              </span>
              {o}
            </li>
          ))}
        </ol>
      </div>
      <div className="animate-float absolute bottom-0 -left-6 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 px-4 py-3 shadow-[0_18px_40px_#034e3a29]">
        <span className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-2 to-brand text-white">
          <ListChecks className="size-5" aria-hidden />
          <span className="animate-ping-soft absolute -top-1 -right-1 size-3 rounded-full border-2 border-surface bg-[#35c98d]" />
        </span>
        <span>
          <span className="font-display block text-heading">পড়ার পরেই অনুশীলন</span>
          <span className="text-sm text-muted">ব্যাখ্যাসহ প্রতিটি উত্তর</span>
        </span>
      </div>
    </div>
  );
}

function ExamGrid() {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {EXAMS.map((exam, i) => {
        const { live } = exam;
        return (
          <StaggerItem key={exam.slug}>
            <PressLink
              href={exam.href}
              className={`lift group flex h-full flex-col overflow-hidden rounded-[22px] border bg-[linear-gradient(180deg,#ffffff0f,#ffffff05)] p-6 pb-5 hover:shadow-[0_24px_48px_#00000047] ${
                live ? "border-mint/30 hover:border-mint/50" : "border-dashed border-mint/20"
              }`}
            >
              <span
                aria-hidden
                className="font-display pointer-events-none absolute top-2 right-5 select-none text-6xl leading-none text-mint/10 transition-colors group-hover:text-mint/20"
              >
                {num("bn", String(i + 1).padStart(2, "0"))}
              </span>
              <h3 className="font-display relative pr-14 text-2xl leading-snug text-white">{exam.title}</h3>
              <p className="relative mt-3 flex-1 text-[#d6e6df]">
                {live ? (
                  <Suspense fallback="সিলেবাস, নোট ও প্রশ্ন">
                    <ExamSummary exam={exam.slug} />
                  </Suspense>
                ) : (
                  "নোট ও প্রশ্ন শীঘ্রই আসছে"
                )}
              </p>
              <span className="relative mt-5 flex items-center justify-between gap-3 border-t border-mint/15 pt-4">
                {live ? (
                  <span className="font-semibold text-[#9fe0c4]">প্রস্তুতি শুরু করুন</span>
                ) : (
                  <span className="rounded-full bg-[#f2c94c]/15 px-2.5 py-0.5 text-sm font-medium text-[#f2c94c]">শীঘ্রই</span>
                )}
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

async function ExamSummary({ exam }: { exam: string }) {
  const { subjects, total, topicCount } = await loadSyllabus(exam);
  return total > 0
    ? `প্রিলিমিনারি · ${countLabel("bn", "subjects", subjects.length)} · ${num("bn", total)} নম্বর`
    : `${countLabel("bn", "subjects", subjects.length)} · ${countLabel("bn", "topics", topicCount)} · সমাধানসহ`;
}
