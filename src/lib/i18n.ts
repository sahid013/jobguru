import type { Lang } from "./types";

// Labels shown inside a subject follow that subject's language, so Bangla
// subjects read fully in Bangla and English subjects fully in English.
const labels = {
  marks: { bn: "নম্বর", en: "Marks" },
  topics: { bn: "বিষয়সমূহ", en: "Topics" },
  sources: { bn: "বই / সোর্সের তালিকা", en: "Books & Sources" },
  note: { bn: "বিঃদ্রঃ", en: "Note" },
  notes: { bn: "নোট", en: "Notes" },
  noNotes: {
    bn: "এই অংশের নোট এখনো যোগ করা হয়নি।",
    en: "Notes for this section haven't been added yet.",
  },
  noTopics: {
    bn: "এই বিষয়ের অধ্যায়গুলো শীঘ্রই যোগ করা হবে।",
    en: "Topics for this subject will be added soon.",
  },
  practice: { bn: "অনুশীলন করুন", en: "Practice MCQs" },
  questions: { bn: "টি প্রশ্ন", en: " questions" },
  noQuestions: {
    bn: "এই অংশের প্রশ্ন এখনো যোগ করা হয়নি।",
    en: "No questions have been added for this section yet.",
  },
  subtopics: { bn: "উপ-বিষয়", en: "Sub-topics" },
  check: { bn: "উত্তর দেখুন", en: "Check answer" },
  next: { bn: "পরবর্তী", en: "Next" },
  restart: { bn: "আবার শুরু করুন", en: "Start again" },
  score: { bn: "আপনার স্কোর", en: "Your score" },
  explanation: { bn: "ব্যাখ্যা", en: "Explanation" },
  correct: { bn: "সঠিক!", en: "Correct!" },
  wrong: { bn: "ভুল উত্তর", en: "Incorrect" },
  question: { bn: "প্রশ্ন", en: "Question" },
  backTo: { bn: "ফিরে যান", en: "Back to" },
} satisfies Record<string, Record<Lang, string>>;

export type LabelKey = keyof typeof labels;

export function t(lang: Lang, key: LabelKey) {
  return labels[key][lang];
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Formats a number with Bangla digits for Bangla content, Latin digits otherwise. */
export function num(lang: Lang, n: number | string) {
  const s = String(n);
  return lang === "bn" ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : s;
}
