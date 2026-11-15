import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EmptyState } from "@/components/empty-state";
import { SubjectGrid, SubjectGridSkeleton, loadSyllabus } from "@/components/exam-syllabus";
import { PressLink } from "@/components/motion";
import { EXAMS, findExam, type Exam } from "@/lib/exams";
import { countLabel, num } from "@/lib/i18n";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ exam: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exams/[exam]">): Promise<Metadata> {
  const exam = findExam((await params).exam);
  return { title: exam?.heading ?? exam?.title };
}

export default function ExamPage({ params }: PageProps<"/exams/[exam]">) {
  return (
    <Suspense fallback={<div className="full-bleed panel-deep -mt-8 -mb-16 h-[70vh]" aria-busy />}>
      <ExamContent params={params} />
    </Suspense>
  );
}

async function ExamContent({ params }: Pick<PageProps<"/exams/[exam]">, "params">) {
  const exam = findExam((await params).exam);
  if (!exam) notFound();
  return exam.live ? <Syllabus exam={exam} /> : <ComingSoon exam={exam} />;
}

function Syllabus({ exam }: { exam: Exam }) {
  return (
    <section className="full-bleed panel-deep -mt-8 -mb-16 px-4 pt-14 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
      <div className="glow glow-gold -right-24 -top-24 size-[480px]" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-[#f2c94c]">সিলেবাস</p>
            <h1 className="font-display mt-1 text-4xl sm:text-5xl sm:leading-tight">{exam.heading ?? exam.title}</h1>
            <Suspense fallback={<p className="mt-3 h-6 w-64 rounded-full bg-white/10 animate-pulse" />}>
              <Summary exam={exam} />
            </Suspense>
          </div>
          <Suspense>
            <StartButton exam={exam.slug} />
          </Suspense>
        </div>
        <Suspense fallback={<SubjectGridSkeleton />}>
          <SubjectGrid exam={exam.slug} />
        </Suspense>
      </div>
    </section>
  );
}

async function Summary({ exam }: { exam: Exam }) {
  const { subjects, total, topicCount } = await loadSyllabus(exam.slug);
  const size = total > 0 ? `মোট ${num("bn", total)} নম্বর` : countLabel("bn", "topics", topicCount);
  return (
    <p className="mt-3 max-w-2xl text-[#d6e6df]">
      {countLabel("bn", "subjects", subjects.length)} · {size}
      {exam.blurb && ` · ${exam.blurb}`}
    </p>
  );
}

async function StartButton({ exam }: { exam: string }) {
  const { startHere } = await loadSyllabus(exam);
  return (
    startHere && (
      <PressLink
        href={`/subjects/${startHere.subject.slug}`}
        className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#034e3a] transition-colors hover:bg-gold hover:text-white"
      >
        পড়া শুরু করুন
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </PressLink>
    )
  );
}

function ComingSoon({ exam }: { exam: Exam }) {
  return (
    <div className="mx-auto max-w-2xl pt-6">
      <div className="panel-deep mb-6 rounded-[26px] px-6 py-8 sm:px-10">
        <p className="relative text-sm font-semibold text-gold">পরীক্ষার প্রস্তুতি</p>
        <h1 className="font-display relative mt-1 text-3xl sm:text-4xl">{exam.title}</h1>
      </div>
      <EmptyState
        title="নোট ও প্রশ্ন শীঘ্রই আসছে"
        body={`${exam.title}-এর সিলেবাস, নোট আর MCQ যোগ করা হচ্ছে। ততক্ষণ অন্য পরীক্ষার অংশ থেকে প্রস্তুতি চালিয়ে যান।`}
        action={
          <PressLink
            href="/#exams"
            className="rounded-full bg-brand px-4 py-2 font-semibold text-brand-ink shadow-[0_8px_20px_#034e3a2e] transition-colors hover:bg-brand-2"
          >
            সব পরীক্ষা দেখুন
          </PressLink>
        }
      />
    </div>
  );
}
