/** Exams listed in the header menu and on the home page. `live` ones have subjects in the database. */
export type Exam = {
  slug: string;
  title: string;
  href: string;
  live: boolean;
  /** Page heading and one-line summary on the exam's own page. */
  heading?: string;
  blurb?: string;
};

export const EXAMS: Exam[] = [
  {
    slug: "bcs",
    title: "বিসিএস",
    href: "/exams/bcs",
    live: true,
    heading: "বিসিএস প্রিলিমিনারি",
    blurb: "প্রতিটি বিষয়ে টপিক, নোট ও MCQ",
  },
  { slug: "last-moment", title: "Last Moment", href: "/exams/last-moment", live: false },
  { slug: "bank-it", title: "Bank IT", href: "/exams/bank-it", live: false },
  {
    slug: "gas-field",
    title: "Gas Field",
    href: "/exams/gas-field",
    live: true,
    heading: "Gas Field · পেট্রোবাংলা CSE/IT",
    blurb: "পেট্রোবাংলা ও গ্যাস কোম্পানিগুলোর বিগত লিখিত প্রশ্ন—টপিক ধরে ধরে, ব্যাখ্যাসহ সমাধান",
  },
  { slug: "petro-1000", title: "1000+ Petro", href: "/exams/petro-1000", live: false },
  { slug: "buet-non-tech", title: "BUET Pattern Non Tech", href: "/exams/buet-non-tech", live: false },
];

export const findExam = (slug: string) => EXAMS.find((e) => e.slug === slug);

/** First breadcrumb for pages inside a subject: back to that subject's exam. */
export function examCrumb(slug: string) {
  const exam = findExam(slug) ?? EXAMS[0];
  return { href: exam.href, label: exam.title, lang: "bn" as const };
}
