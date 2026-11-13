// BCS Preliminary syllabus (200 marks) — the seed source of truth.
// `npm run db:seed-sql` turns this into supabase/seed.sql.
// The app also reads from here when Supabase is not configured yet.

import type { Lang, SourceGroup } from "@/lib/types";

export type SeedTopic = {
  slug: string;
  title: string;
  description?: string;
  points?: string[];
  marks?: number;
  children?: SeedTopic[];
};

export type SeedSubject = {
  slug: string;
  lang: Lang;
  title: string;
  marks: number;
  sources?: SourceGroup[];
  source_note?: string;
  topics: SeedTopic[];
};

const PDF_NOTE = "অনেক বই PDF আকারে পাওয়া যায়; সকল বোর্ড বই NCTB ওয়েবসাইটে আছে।";

export const syllabus: SeedSubject[] = [
  {
    slug: "bangla",
    lang: "bn",
    title: "বাংলা ভাষা ও সাহিত্য",
    marks: 30,
    topics: [
      {
        slug: "bhasha",
        title: "ভাষা",
        marks: 15,
        description:
          "প্রয়োগ-অপপ্রয়োগ, বানান ও বাক্য শুদ্ধি, পরিভাষা, সমার্থক ও বিপরীতার্থক শব্দ, ধ্বনি, বর্ণ, শব্দ, পদ, বাক্য, প্রত্যয়, সন্ধি ও সমাস।",
      },
      { slug: "sahitya-prachin-madhyajug", title: "সাহিত্য — প্রাচীন ও মধ্যযুগ", marks: 5 },
      {
        slug: "sahitya-adhunik-jug",
        title: "সাহিত্য — আধুনিক যুগ",
        marks: 10,
        description: "১৮০০ সাল থেকে বর্তমান পর্যন্ত।",
      },
    ],
    sources: [
      {
        heading: null,
        items: [
          "ব্যাকরণ বোর্ড বই — নবম-দশম শ্রেণী",
          "বাংলা ভাষা ও সাহিত্য জিজ্ঞাসা — সৌমিত্র শেখর",
          "বাংলা সাহিত্যের ইতিহাস — মাহবুবুল আলম",
          "লাল নীল দীপাবলি / বাঙলা সাহিত্যের জীবনী — হুমায়ুন আজাদ",
          "কতো নদী সরোবর / বাঙলা ভাষার জীবনী — হুমায়ুন আজাদ",
          "বাংলাপিডিয়া (লেখকদের পেজ)",
          "বিগত বিসিএস প্রিলি প্রশ্ন (বিষয়ভিত্তিক)",
          "যেকোনো গাইড বই",
        ],
      },
    ],
    source_note: PDF_NOTE,
  },
  {
    slug: "english",
    lang: "en",
    title: "English Language & Literature",
    marks: 30,
    topics: [
      {
        slug: "part-1-language",
        title: "Part I — Language",
        marks: 15,
        children: [
          {
            slug: "parts-of-speech",
            title: "A) Parts of Speech",
            points: [
              "Noun: Determiner, Gender, Number, Pronoun",
              "Verb: Finite & Non-finite, Linking, Phrasal, Modals",
              "Adjective, Adverb, Preposition, Conjunction",
            ],
          },
          {
            slug: "idioms-phrases",
            title: "B) Idioms & Phrases",
            points: ["Meanings, Kinds, Identifying Phrases"],
          },
          {
            slug: "clauses",
            title: "C) Clauses",
            points: ["Principal, Subordinate, Noun, Adjective, Adverbial"],
          },
          {
            slug: "corrections",
            title: "D) Corrections",
            points: [
              "Tense, Verb, Preposition, Determiner, Gender, Number, Subject-Verb Agreement",
            ],
          },
          {
            slug: "sentences-transformations",
            title: "E) Sentences & Transformations",
            points: ["Simple / Compound / Complex; Active & Passive; Degrees"],
          },
          {
            slug: "words",
            title: "F) Words",
            points: ["Meanings, Synonyms, Antonyms, Spellings, Prefix/Suffix"],
          },
          {
            slug: "composition",
            title: "G) Composition",
            points: ["Parts of paragraphs / letters / applications"],
          },
        ],
      },
      {
        slug: "part-2-literature",
        title: "Part II — Literature",
        marks: 15,
        points: [
          "Writers from the Elizabethan period to the 21st Century",
          "Quotations from drama / poetry of different ages",
        ],
      },
    ],
    sources: [
      {
        heading: "Grammar — 15",
        items: ["Any standard grammar guide book"],
      },
      {
        heading: "Literature — 15",
        items: [
          "An ABC of English Literature — Dr. M. Mofizar Rahman",
          "History of English Literature — Shitol Ghosh",
          "Previous BCS preliminary questions (topic-wise)",
        ],
      },
    ],
  },
  {
    slug: "bangladesh-affairs",
    lang: "bn",
    title: "বাংলাদেশ বিষয়াবলি",
    marks: 25,
    topics: [
      {
        slug: "jatiyo-bishoyaboli",
        title: "জাতীয় বিষয়াবলি",
        marks: 6,
        description:
          "প্রাচীনকাল থেকে সম-সাময়িক ইতিহাস, কৃষ্টি ও সংস্কৃতি; স্বাধীনতা যুদ্ধের ইতিহাস — ভাষা আন্দোলন, ১৯৫৪-এর নির্বাচন, ছয়-দফা (১৯৬৬), গণ অভ্যুত্থান (১৯৬৮-৬৯), ১৯৭০-এর নির্বাচন, অসহযোগ আন্দোলন (১৯৭১), ৭ মার্চের ভাষণ, স্বাধীনতা ঘোষণা, মুজিবনগর সরকার, রণকৌশল, বৃহৎ শক্তিবর্গের ভূমিকা, পাক বাহিনীর আত্মসমর্পণ ও বাংলাদেশের অভ্যুদয়।",
      },
      {
        slug: "krishij-sampad",
        title: "কৃষিজ সম্পদ",
        marks: 2,
        description: "শস্য উৎপাদন ও বহুমুখীকরণ, খাদ্য উৎপাদন ও ব্যবস্থাপনা।",
      },
      {
        slug: "jonosongkha",
        title: "জনসংখ্যা",
        marks: 2,
        description: "আদমশুমারি, জাতি, গোষ্ঠী ও উপজাতি সংক্রান্ত বিষয়াদি।",
      },
      {
        slug: "orthoniti",
        title: "অর্থনীতি",
        marks: 2,
        description:
          "উন্নয়ন পরিকল্পনা ও পঞ্চবার্ষিকী, জাতীয় আয়-ব্যয়, রাজস্ব নীতি, বার্ষিক উন্নয়ন কর্মসূচি, দারিদ্র্য বিমোচন ইত্যাদি।",
      },
      {
        slug: "shilpo-banijyo",
        title: "শিল্প ও বাণিজ্য",
        marks: 2,
        description:
          "শিল্প উৎপাদন, আমদানি-রপ্তানি, গার্মেন্টস শিল্প, বৈদেশিক লেন-দেন, অর্থ প্রেরণ, ব্যাংক ও বীমা ব্যবস্থাপনা ইত্যাদি।",
      },
      {
        slug: "songbidhan",
        title: "সংবিধান",
        marks: 3,
        description:
          "প্রস্তাবনা ও বৈশিষ্ট্য, মৌলিক অধিকার, রাষ্ট্র পরিচালনার মূলনীতি, সংশোধনীসমূহ।",
      },
      {
        slug: "rajnoitik-byabostha",
        title: "রাজনৈতিক ব্যবস্থা",
        marks: 3,
        description:
          "রাজনৈতিক দলের গঠন, ভূমিকা ও কার্যক্রম, ক্ষমতাসীন-বিরোধী সম্পর্ক, সুশীল সমাজ ও চাপ সৃষ্টিকারী গোষ্ঠী।",
      },
      {
        slug: "sorkar-byabostha",
        title: "সরকার ব্যবস্থা",
        marks: 3,
        description:
          "আইন, শাসন ও বিচার বিভাগ, আইন প্রণয়ন, নীতি নির্ধারণ, জাতীয় ও স্থানীয় প্রশাসনিক কাঠামো, পুনর্বিন্যাস ও সংস্কার।",
      },
      {
        slug: "jatiyo-orjon",
        title: "জাতীয় অর্জন",
        marks: 2,
        description:
          "বিশিষ্ট ব্যক্তিত্ব, গুরুত্বপূর্ণ প্রতিষ্ঠান ও স্থাপনা, জাতীয় পুরস্কার, খেলাধুলা, চলচ্চিত্র ও গণমাধ্যম।",
      },
    ],
    sources: [
      {
        heading: null,
        items: [
          "বাংলাদেশের সংবিধান",
          "সরকারি মন্ত্রণালয় / সংস্থার ওয়েবসাইট",
          "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা — নবম-দশম",
          "উচ্চ মাধ্যমিক ইতিহাস প্রথম পত্র",
          "অর্থনীতি বোর্ড বই — নবম-দশম (সংশ্লিষ্ট অধ্যায়)",
          "উচ্চ মাধ্যমিক অর্থনীতি দ্বিতীয় পত্র",
          "পৌরনীতি ও নাগরিকতা — নবম-দশম",
          "বাংলাদেশ ও বিশ্বপরিচয় — নবম-দশম",
          "বিগত বিসিএস প্রিলি প্রশ্ন (বিষয়ভিত্তিক)",
          "সাম্প্রতিক সমাচার ও দৈনিক পত্রিকা",
        ],
      },
    ],
    source_note: PDF_NOTE,
  },
  {
    slug: "international-affairs",
    lang: "bn",
    title: "আন্তর্জাতিক বিষয়াবলি",
    marks: 25,
    topics: [
      {
        slug: "boishwik-itihas",
        title: "বৈশ্বিক ইতিহাস",
        marks: 5,
        description: "আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি।",
      },
      {
        slug: "nirapotta-khomota-somporko",
        title: "নিরাপত্তা ও ক্ষমতা সম্পর্ক",
        marks: 5,
        description: "আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক।",
      },
      {
        slug: "cholman-ghotonaprobaho",
        title: "চলমান ঘটনাপ্রবাহ",
        marks: 5,
        description: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ।",
      },
      {
        slug: "poribesh-kutniti",
        title: "পরিবেশ ও কূটনীতি",
        marks: 5,
        description: "আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি।",
      },
      {
        slug: "antorjatik-songothon",
        title: "আন্তর্জাতিক সংগঠন",
        marks: 5,
        description: "আন্তর্জাতিক সংগঠন ও বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি।",
      },
    ],
    sources: [
      {
        heading: null,
        items: [
          "উচ্চ মাধ্যমিক ইতিহাস দ্বিতীয় পত্র",
          "ইতিহাসের যেকোনো বই, history.com/topics, Wikipedia",
          "নিয়মিত আন্তর্জাতিক পত্রিকা ও টিভি চ্যানেল",
          "আন্তর্জাতিক সংগঠনের ওয়েবসাইট (নোট করে রাখবেন)",
          "বিগত বিসিএস প্রিলি প্রশ্ন (বিষয়ভিত্তিক)",
        ],
      },
    ],
    source_note: "উইকিপিডিয়ার সংখ্যাগত তথ্য আলাদাভাবে যাচাই করবেন এবং সোর্স যথাযথ কিনা দেখে নিবেন।",
  },
  // The subjects below only have their marks for now — add topics as you go.
  { slug: "geography", lang: "bn", title: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা", marks: 10, topics: [] },
  { slug: "general-science", lang: "bn", title: "সাধারণ বিজ্ঞান", marks: 15, topics: [] },
  { slug: "computer-ict", lang: "bn", title: "কম্পিউটার ও তথ্য প্রযুক্তি", marks: 15, topics: [] },
  { slug: "math", lang: "bn", title: "গাণিতিক যুক্তি", marks: 20, topics: [] },
  { slug: "mental-ability", lang: "bn", title: "মানসিক দক্ষতা", marks: 15, topics: [] },
  { slug: "ethics", lang: "bn", title: "নৈতিকতা, মূল্যবোধ ও সু-শাসন", marks: 15, topics: [] },
];
