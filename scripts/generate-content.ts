// Builds supabase/content/iba-50-words.sql from scripts/content/iba-50-words.ts:
//   • one Markdown note under English → Part I → F) Words
//   • one meaning-match MCQ per word, so the topic's Practice button works
// Usage: npm run content:sql → paste the file into the Supabase SQL Editor.
// Re-runnable: it replaces the note with the same title and the questions it created earlier.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { slugify } from "../src/components/markdown";
import { NOTE_TITLE, QUESTION_SOURCE_SUFFIX, TOPIC, words, type VocabWord } from "./content/iba-50-words";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const arr = (v: string[]) => `array[${v.map(q).join(", ")}]::text[]`;

// Deterministic shuffle so the SQL doesn't change on every run.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

// ───────────────────────── Note (Markdown) ─────────────────────────

const LIST_HEADING = "Practice: all 50 words";
const heading = (w: VocabWord, i: number) => `${i + 1}. ${w.word}`;

// Self-test list: see the word, recall the meaning, tap to check.
const wordList = words.map((w, i) => `**${i + 1}.** [${w.word}](#${slugify(heading(w, i))})`).join(" · ");

function wordEntry(w: VocabWord, i: number) {
  const src = w.source === "—" ? "" : ` · IBA ${w.source}`;
  const lines = [
    `### ${heading(w, i)}`,
    `*${w.pos}* — **${w.bn}**${src}`,
    "",
    capitalize(w.en) + ".",
    "",
    `> ${w.example}`,
  ];
  if (w.tip) lines.push("", `**মনে রাখুন:** ${w.tip}`);
  lines.push("", `[↑ শব্দতালিকায় ফিরুন](#${slugify(LIST_HEADING)})`);
  return lines.join("\n");
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const noteBody = [
  `Each entry gives the part of speech, the Bangla meaning, a plain-English definition, an example sentence, and the IBA exam(s) where the word appeared.`,
  ``,
  `প্রতিটি শব্দের নিচে **মনে রাখুন** অংশে বাংলায় মনে রাখার কৌশল, বানানের ফাঁদ ও কাছাকাছি শব্দের পার্থক্য দেওয়া আছে।`,
  ``,
  `## ${LIST_HEADING}`,
  ``,
  `পড়া শেষ হলে এখানে ফিরে আসুন: প্রতিটি শব্দ দেখে অর্থ মনে করার চেষ্টা করুন, তারপর শব্দে ক্লিক করে মিলিয়ে নিন।`,
  ``,
  wordList,
  ``,
  `---`,
  ``,
  ...words.map(wordEntry).flatMap((e) => [e, ""]),
  `---`,
  ``,
  `## একনজরে: যে শব্দগুলো গুলিয়ে যায়`,
  ``,
  `| একই রকম শোনায় / একই অর্থ | পার্থক্য |`,
  `|---|---|`,
  `| **Loquacious / Garrulous** vs **Laconic** | প্রথম দুটি = বাচাল; Laconic = স্বল্পভাষী (বিপরীত) |`,
  `| **Assuage / Placate / Mitigate** | অনুভূতি কমানো / মানুষকে শান্ত করা / ক্ষতি-তীব্রতা কমানো |`,
  `| **Vacillate / Waver** | দুটোই দ্বিধায় দোলা; Waiver (মওকুফ) আলাদা শব্দ |`,
  `| **Torpor / Lethargic / Enervate** | noun / adj. / verb—সবই শক্তিহীনতা নিয়ে |`,
  `| **Capricious / Volatile** | মানুষের মেজাজ / পরিস্থিতি-বাজার—দুটোই অস্থির |`,
  `| **Corroborate / Bolster** | প্রমাণ দিয়ে নিশ্চিত করা / শক্তিশালী করা |`,
  `| **Ingenuous ≠ Ingenious** | সরল ≠ উদ্ভাবনী |`,
  `| **Prodigal ≠ Prodigy** | অমিতব্যয়ী ≠ বিস্ময় প্রতিভা |`,
  `| **Enervate ≠ Energize** | দুর্বল করা ≠ চাঙ্গা করা |`,
  `| **Eulogy / Elegy** | প্রশংসা-বক্তৃতা / শোকগাথা |`,
  `| **Venerate ↔ Deride** | শ্রদ্ধা করা ↔ উপহাস করা |`,
  `| **Cacophony ↔ Euphony** | কর্কশ ↔ শ্রুতিমধুর |`,
  ``,
  `## কীভাবে পড়বেন`,
  ``,
  `1. একদিনে সব নয়—প্রতিদিন ১০টি শব্দ, পাঁচ দিনে শেষ করুন।`,
  `2. প্রতিটি শব্দ দিয়ে নিজের একটি বাক্য লিখুন; উদাহরণ মুখস্থ করার চেয়ে এটা বেশি কাজে দেয়।`,
  `3. পড়া শেষে নিচের **Practice MCQs** দিন। ভুলগুলো পরদিন আবার দেখুন।`,
].join("\n");

// ───────────────────────── Questions ─────────────────────────

const random = rng(50);

function question(w: VocabWord) {
  const pool = words.filter((o) => o !== w && (!w.group || o.group !== w.group));
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const pick = pool[Math.floor(random() * pool.length)].en;
    if (!distractors.includes(pick)) distractors.push(pick);
  }
  const options = [w.en, ...distractors].map(capitalize);
  // Shuffle in place, tracking where the correct answer lands.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const correct = options.indexOf(capitalize(w.en));
  const source = (w.source === "—" ? "IBA" : `IBA ${w.source}`) + ` ${QUESTION_SOURCE_SUFFIX}`;
  const explanation = `${w.word} (${w.bn}) — ${w.en}. e.g. ${w.example}`;
  return { stem: `The word "${w.word.toUpperCase()}" means —`, options, correct, explanation, source };
}

// ───────────────────────── SQL ─────────────────────────

const subject = `(select id from public.subjects where slug = 'english')`;
const topicBySlug = (slug: string) =>
  `(select id from public.topics where subject_id = ${subject} and slug = ${q(slug)})`;
const parent = topicBySlug(TOPIC.parentSlug);
const topic = topicBySlug(TOPIC.slug);

const out: string[] = [
  "-- Generated by scripts/generate-content.ts — do not edit by hand.",
  "begin;",
  "",
  `-- The sub-topic that holds this word list (created on first run, updated after)`,
  `insert into public.topics (subject_id, parent_id, slug, title, description, points, marks, sort_order)`,
  `values (${subject}, ${parent}, ${q(TOPIC.slug)}, ${q(TOPIC.title)}, ${q(TOPIC.description)}, '{}', null, 0)`,
  `on conflict (subject_id, slug) do update set parent_id = excluded.parent_id, title = excluded.title,`,
  `  description = excluded.description, sort_order = excluded.sort_order;`,
  "",
  `-- Remove what earlier runs created, whether it was placed under the parent or under this sub-topic`,
  `delete from public.notes where topic_id in (${parent}, ${topic})`,
  `  and title in (${q(NOTE_TITLE)}, ${q(TOPIC.title)});`,
  `delete from public.questions where topic_id in (${parent}, ${topic})`,
  `  and source like ${q(`%${QUESTION_SOURCE_SUFFIX}`)};`,
  "",
  `-- The note`,
  `insert into public.notes (topic_id, title, body, published, sort_order)`,
  `values (${topic}, ${q(NOTE_TITLE)}, ${q(noteBody)}, true, 0);`,
  "",
  `-- The questions`,
];

for (const w of words) {
  const { stem, options, correct, explanation, source } = question(w);
  out.push(
    `insert into public.questions (topic_id, stem, options, correct_index, explanation, source, published)`,
    `values (${topic}, ${q(stem)}, ${arr(options)}, ${correct}, ${q(explanation)}, ${q(source)}, true);`,
  );
}

out.push("", "commit;", "");

const dir = join(process.cwd(), "supabase", "content");
mkdirSync(dir, { recursive: true });
const file = join(dir, "iba-50-words.sql");
writeFileSync(file, out.join("\n"));
console.log(`Wrote ${file} — 1 note, ${words.length} questions`);
