// Builds supabase/content/gas-field.sql from scripts/content/gas-field/*.md (+ mcqs.ts):
//   • one subject per area (exam = 'gas-field'), one topic + note per past question
//   • a "question papers" subject listing every paper with links to its solutions
//   • practice MCQs for the aptitude topics
// Usage: npm run content:gas-field → paste the file into the Supabase SQL editor.
// Re-runnable: rows have stable ids (md5 of their slug), so a rerun updates them in place.
//
// Markdown format:
//   === subject <slug> | <title> [| bn]
//   === topic <slug> | <title> | PAPER:Qn, PAPER:Qn
//   <note body>  — {{PAPER:Qn}} expands to "Organisation · Post · Date · Qn"

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MCQS } from "./content/gas-field/mcqs";

const EXAM = "gas-field";

type Paper = { org: string; post: string; date: string; sort: string };
const PAPERS: Record<string, Paper> = {
  JG_SAE: { org: "Jalalabad Gas (JGTDSL)", post: "Sub Assistant Engineer (Computer)", date: "17/09/2021", sort: "2021-09-17" },
  JG_AE: { org: "Jalalabad Gas (JGTDSL)", post: "Assistant Engineer (CSE)", date: "08/10/2021", sort: "2021-10-08" },
  BG_SAE: { org: "Bakhrabad Gas (BGDCL)", post: "Sub Assistant Engineer (CSE)", date: "19/11/2021", sort: "2021-11-19a" },
  BG_AE: { org: "Bakhrabad Gas (BGDCL)", post: "Assistant Engineer (CSE)", date: "19/11/2021", sort: "2021-11-19b" },
  GT_SAE: { org: "Gas Transmission Co. (GTCL)", post: "Sub Assistant Engineer (CSE)", date: "26/11/2021", sort: "2021-11-26" },
  RP: { org: "Rupantarita Prakritik Gas (RPGCL)", post: "AGM (ICT)", date: "2022", sort: "2022-01-01" },
  BO_22: { org: "Petrobangla (BOGMC)", post: "Assistant Manager (Hardware/Software)", date: "16/09/2022", sort: "2022-09-16" },
  PB: { org: "Petrobangla", post: "Assistant Engineer", date: "16/12/2022", sort: "2022-12-16" },
  BP: { org: "BAPEX", post: "AGM (ICT)", date: "20/01/2023", sort: "2023-01-20" },
  BG_AM: { org: "Bakhrabad Gas (BGDCL)", post: "Assistant Manager (CSE)", date: "15/03/2024", sort: "2024-03-15" },
  TG: { org: "Titas Gas (TGTDCL)", post: "Assistant Engineer (CSE)", date: "24/05/2024", sort: "2024-05-24" },
  BO_24: { org: "Petrobangla (BOGMC)", post: "Assistant Manager (CSE/IT/ICT)", date: "31/05/2024", sort: "2024-05-31" },
};

type Ref = { paper: string; q: string };
type Topic = { slug: string; title: string; refs: Ref[]; body: string };
type Subject = { slug: string; title: string; lang: "bn" | "en"; topics: Topic[] };

const parseRefs = (s: string): Ref[] =>
  s.split(",").map((r) => {
    const [paper, q] = r.trim().split(":");
    if (!PAPERS[paper] || !q) throw new Error(`Bad ref "${r}"`);
    return { paper, q };
  });

const paperLabel = (key: string) => `${PAPERS[key].org} · ${PAPERS[key].post} · ${PAPERS[key].date}`;

// ───────────────────────── Parse ─────────────────────────

const dir = join(process.cwd(), "scripts", "content", "gas-field");
const subjects: Subject[] = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
  let topic: Topic | null = null;
  for (const line of readFileSync(join(dir, file), "utf8").split("\n")) {
    const m = line.match(/^=== (subject|topic) (.+)$/);
    if (!m) {
      if (topic) topic.body += line + "\n";
      continue;
    }
    const parts = m[2].split(" | ").map((s) => s.trim());
    if (m[1] === "subject") {
      subjects.push({ slug: parts[0], title: parts[1], lang: parts[2] === "bn" ? "bn" : "en", topics: [] });
      topic = null;
    } else {
      topic = { slug: parts[0], title: parts[1], refs: parseRefs(parts[2]), body: "" };
      subjects.at(-1)!.topics.push(topic);
    }
  }
}

for (const s of subjects)
  for (const t of s.topics) {
    t.body = t.body.trim().replace(/\{\{(\w+):(\w+)\}\}/g, (_, p: string, q: string) => {
      if (!PAPERS[p]) throw new Error(`Unknown paper ${p} in ${t.slug}`);
      return `${paperLabel(p)} · ${q}`;
    });
    if (t.body.includes("{{")) throw new Error(`Unexpanded placeholder in ${t.slug}`);
  }

// ───────────────────────── Paper-wise index ─────────────────────────

const qOrder = (q: string) => {
  const m = q.match(/^Q(\d+)([a-z]?)$/);
  return m ? Number(m[1]) * 100 + (m[2] ? m[2].charCodeAt(0) : 0) : 9999;
};

const paperSubject: Subject = { slug: "gf-question-papers", title: "Exam-wise Question Papers", lang: "en", topics: [] };
for (const key of Object.keys(PAPERS).sort((a, b) => PAPERS[a].sort.localeCompare(PAPERS[b].sort))) {
  const p = PAPERS[key];
  const rows = subjects
    .flatMap((s) => s.topics.flatMap((t) => t.refs.filter((r) => r.paper === key).map((r) => ({ q: r.q, s, t }))))
    .sort((a, b) => qOrder(a.q) - qOrder(b.q));
  if (rows.length === 0) continue;
  const body = [
    `**${p.org}** · ${p.post} · Exam date ${p.date} · Set by BUET`,
    "",
    "| Q | Topic | Area | |",
    "|---|---|---|---|",
    ...rows.map(({ q, s, t }) => `| ${q} | ${t.title} | ${s.title} | [Solution →](/subjects/${s.slug}/${t.slug}) |`),
    "",
    "> Solve each question on paper first, then open its solution.",
  ].join("\n");
  paperSubject.topics.push({
    slug: `${key.toLowerCase().replace(/_/g, "-")}-${p.sort.slice(0, 4)}`,
    title: `${p.org.replace(/ \(.*\)/, "")} — ${p.post} (${p.date})`,
    refs: [],
    body,
  });
}
subjects.push(paperSubject);

// ───────────────────────── SQL ─────────────────────────

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const arr = (v: string[]) => `array[${v.map(q).join(", ")}]::text[]`;
const id = (key: string) => `md5(${q(`gas-field:${key}`)})::uuid`;

const chunks: string[][] = [];
let noteCount = 0;
let questionCount = 0;

subjects.forEach((s, si) => {
  const noteTitle = s === paperSubject ? "Question paper" : s.lang === "bn" ? "প্রশ্ন ও সমাধান" : "Question & solution";
  const rows = s.topics.map((t, ti) => {
    const description = t.refs.length ? [...new Set(t.refs.map((r) => paperLabel(r.paper)))].join(" | ") : null;
    return `  (${q(t.slug)}, ${q(t.title)}, ${description ? q(description) : "null"}, ${ti}, ${q(t.body)})`;
  });
  noteCount += s.topics.length;
  const out: string[] = [
    `-- ${s.title}`,
    `insert into public.subjects (slug, exam, lang, title, marks, sort_order)`,
    `values (${q(s.slug)}, ${q(EXAM)}, ${q(s.lang)}, ${q(s.title)}, 0, ${si})`,
    `on conflict (slug) do update set exam = excluded.exam, lang = excluded.lang, title = excluded.title, sort_order = excluded.sort_order;`,
    `with src (slug, title, description, sort_order, body) as (values`,
    rows.join(",\n"),
    `), subj as (select id from public.subjects where slug = ${q(s.slug)}),`,
    `ins as (`,
    `  insert into public.topics (subject_id, parent_id, slug, title, description, points, marks, sort_order)`,
    `  select subj.id, null, src.slug, src.title, src.description, '{}', null, src.sort_order from src, subj`,
    `  on conflict (subject_id, slug) do update set title = excluded.title, description = excluded.description, sort_order = excluded.sort_order`,
    `  returning id, slug`,
    `)`,
    `insert into public.notes (id, topic_id, title, body, published, sort_order)`,
    `select md5('gas-field:note:' || ${q(s.slug)} || '/' || ins.slug)::uuid, ins.id, ${q(noteTitle)}, src.body, true, 0`,
    `from ins join src using (slug)`,
    `on conflict (id) do update set title = excluded.title, body = excluded.body, published = true;`,
  ];
  for (const t of s.topics) {
    (MCQS[t.slug] ?? []).forEach((m, mi) => {
      out.push(
        `insert into public.questions (id, topic_id, stem, options, correct_index, explanation, source, published)`,
        `select ${id(`q:${s.slug}/${t.slug}/${mi}`)}, t.id, ${q(m.stem)}, ${arr(m.options)}, ${m.correct}, ${q(m.explanation)}, ${q("পেট্রোবাংলা AE ২০২২")}, true`,
        `from public.topics t join public.subjects s on s.id = t.subject_id where s.slug = ${q(s.slug)} and t.slug = ${q(t.slug)}`,
        `on conflict (id) do update set stem = excluded.stem, options = excluded.options, correct_index = excluded.correct_index, explanation = excluded.explanation;`,
      );
      questionCount++;
    });
  }
  chunks.push(out);
});

const outDir = join(process.cwd(), "supabase", "content");
mkdirSync(outDir, { recursive: true });
const header = ["-- Generated by scripts/generate-gas-field.ts — do not edit by hand.", "-- Needs migrations/0003_subject_exam.sql.", "begin;", ""];
writeFileSync(join(outDir, "gas-field.sql"), [...header, ...chunks.flatMap((c) => [...c, ""]), "commit;", ""].join("\n"));

// Optional: one file per subject, handy for running through a size-limited SQL tool.
const split = process.argv.find((a) => a.startsWith("--split="))?.slice(8);
if (split) {
  mkdirSync(split, { recursive: true });
  chunks.forEach((c, i) => writeFileSync(join(split, `${String(i).padStart(2, "0")}.sql`), c.join("\n") + "\n"));
}

const topicTotal = subjects.reduce((n, s) => n + s.topics.length, 0);
console.log(`Wrote gas-field.sql — ${subjects.length} subjects, ${topicTotal} topics, ${noteCount} notes, ${questionCount} questions`);
