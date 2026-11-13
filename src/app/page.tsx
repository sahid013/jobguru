import Link from "next/link";
import { MarksBadge } from "@/components/ui";
import { getSubjects } from "@/lib/data";
import { num } from "@/lib/i18n";

export default async function HomePage() {
  const subjects = await getSubjects();
  const total = subjects.reduce((sum, s) => sum + s.marks, 0);

  return (
    <div className="space-y-12">
      <section className="pt-4">
        <p className="text-sm font-medium text-brand">বিসিএস প্রিলিমিনারি · {num("bn", total)} নম্বর</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
          সিলেবাস ধরে ধরে, নিজের গতিতে প্রস্তুতি
        </h1>
        <p className="mt-3 max-w-2xl text-muted text-lg">
          প্রতিটি বিষয়ের অধ্যায়, নম্বর বণ্টন, প্রয়োজনীয় বই এবং নোট ও MCQ অনুশীলন — এক জায়গায়।
        </p>
      </section>

      <section id="syllabus" className="scroll-mt-20">
        <div className="rounded-xl border border-line bg-surface overflow-hidden">
          <h2 className="px-5 py-3 text-center text-lg font-semibold bg-brand-soft text-brand">
            বিষয় ও পূর্ণমান
          </h2>
          <ul className="divide-y divide-line">
            {subjects.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/subjects/${s.slug}`}
                  lang={s.lang}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-surface-2 transition-colors"
                >
                  <span className="text-[1.05rem]">{s.title}</span>
                  <MarksBadge lang="bn" marks={s.marks} />
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 px-5 py-3.5 bg-brand-soft">
              <span className="font-semibold text-brand">মোট</span>
              <MarksBadge lang="bn" marks={total} solid />
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
