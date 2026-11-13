import type { Lang } from "./types";

// Labels shown inside a subject follow that subject's language, so Bangla
// subjects read fully in Bangla and English subjects fully in English.
// Site-level chrome (header, home page) is always Bangla.
const labels = {
  marks: { bn: "নম্বর", en: "Marks" },
  overview: { bn: "সারসংক্ষেপ", en: "Overview" },
  contents: { bn: "বিষয়সূচি", en: "Contents" },
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
  noTopicsHint: {
    bn: "আপাতত অন্য বিষয় থেকে প্রস্তুতি চালিয়ে যান।",
    en: "In the meantime, keep going with another subject.",
  },
  practice: { bn: "অনুশীলন করুন", en: "Practice MCQs" },
  practiceHint: { bn: "পড়া শেষ? নিজেকে যাচাই করুন।", en: "Done reading? Test yourself." },
  noQuestions: {
    bn: "এই অংশের প্রশ্ন এখনো যোগ করা হয়নি।",
    en: "No questions have been added for this section yet.",
  },
  subtopics: { bn: "উপ-বিষয়", en: "Sub-topics" },
  start: { bn: "পড়া শুরু করুন", en: "Start learning" },
  prevTopic: { bn: "আগের টপিক", en: "Previous topic" },
  nextTopic: { bn: "পরের টপিক", en: "Next topic" },
  backToOverview: { bn: "সারসংক্ষেপে ফিরুন", en: "Back to overview" },
  backToTopic: { bn: "টপিকে ফিরুন", en: "Back to topic" },
  comingSoon: { bn: "শীঘ্রই আসছে", en: "Coming soon" },
  contentComing: { bn: "নোট ও প্রশ্ন যোগ হচ্ছে", en: "Notes and questions coming soon" },
  emptyTopicTitle: { bn: "এই টপিকের কন্টেন্ট তৈরি হচ্ছে", en: "Content for this topic is on its way" },
  emptyTopicBody: {
    bn: "নোট ও প্রশ্ন যোগ হলে এখানেই পাবেন। আপাতত তালিকা থেকে অন্য টপিক দেখুন।",
    en: "Notes and questions will appear here once added. Meanwhile, pick another topic from the list.",
  },
  allSubjects: { bn: "সব বিষয়", en: "All subjects" },
  // Quiz
  check: { bn: "উত্তর দেখুন", en: "Check answer" },
  next: { bn: "পরবর্তী", en: "Next" },
  finish: { bn: "ফলাফল দেখুন", en: "See results" },
  restart: { bn: "আবার শুরু করুন", en: "Start again" },
  retryWrong: { bn: "শুধু ভুলগুলো আবার", en: "Retry incorrect only" },
  results: { bn: "ফলাফল", en: "Results" },
  score: { bn: "আপনার স্কোর", en: "Your score" },
  allCorrect: { bn: "দারুণ! সব উত্তর সঠিক।", en: "Excellent! Every answer was correct." },
  reviewWrong: { bn: "ভুল উত্তরগুলো দেখে নিন", en: "Review the incorrect answers" },
  yourAnswer: { bn: "আপনার উত্তর", en: "Your answer" },
  correctAnswer: { bn: "সঠিক উত্তর", en: "Correct answer" },
  explanation: { bn: "ব্যাখ্যা", en: "Explanation" },
  correct: { bn: "সঠিক!", en: "Correct!" },
  wrong: { bn: "ভুল উত্তর", en: "Incorrect" },
  question: { bn: "প্রশ্ন", en: "Question" },
  keyboardHint: { bn: "কীবোর্ড: ১–৪ দিয়ে উত্তর, Enter দিয়ে পরবর্তী", en: "Keyboard: 1–4 to answer, Enter for next" },
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

const counted = {
  topics: { bn: "টি টপিক", en: ["topic", "topics"] },
  notes: { bn: "টি নোট", en: ["note", "notes"] },
  questions: { bn: "টি প্রশ্ন", en: ["question", "questions"] },
  subjects: { bn: "টি বিষয়", en: ["subject", "subjects"] },
} satisfies Record<string, { bn: string; en: [string, string] }>;

/** "৩টি নোট" / "3 notes" */
export function countLabel(lang: Lang, key: keyof typeof counted, n: number) {
  if (lang === "bn") return `${num("bn", n)}${counted[key].bn}`;
  return `${n} ${counted[key].en[n === 1 ? 0 : 1]}`;
}
