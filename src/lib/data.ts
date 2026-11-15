import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { syllabus, type SeedTopic } from "@/data/syllabus";
import { isSupabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/public";
import type { Note, Question, Subject, Topic, TopicNode } from "./types";

// All public reads go through this module. Every read hits Supabase at request time
// (React cache() only dedupes calls within one request), so edits made straight in
// Supabase show up on the next page load — no refresh step needed.
// When Supabase isn't configured yet, it serves the bundled syllabus instead.

export const CONTENT_TAG = "content";

const SUBJECT_COLS = "id, slug, exam, lang, title, marks, sort_order, sources, source_note";
const TOPIC_COLS = "id, subject_id, parent_id, slug, title, description, points, marks, sort_order";

/** Subjects of one exam ("bcs", "gas-field", …), in syllabus order. */
export const getSubjects = cache(async (exam: string): Promise<Subject[]> => {
  await connection();
  if (!isSupabaseConfigured) return local.subjects.filter((s) => s.exam === exam);
  const { data, error } = await createPublicClient()
    .from("subjects")
    .select(SUBJECT_COLS)
    .eq("exam", exam)
    .order("sort_order");
  if (error) throw error;
  return data as Subject[];
});

export const getSubject = cache(async (slug: string): Promise<Subject | null> => {
  await connection();
  if (!isSupabaseConfigured) return local.subjects.find((s) => s.slug === slug) ?? null;
  const { data, error } = await createPublicClient()
    .from("subjects")
    .select(SUBJECT_COLS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Subject | null;
});

export const getTopics = cache(async (subjectId: string): Promise<Topic[]> => {
  await connection();
  if (!isSupabaseConfigured) return local.topics.filter((t) => t.subject_id === subjectId);
  const { data, error } = await createPublicClient()
    .from("topics")
    .select(TOPIC_COLS)
    .eq("subject_id", subjectId)
    .order("sort_order");
  if (error) throw error;
  return data as Topic[];
});

export const getNotes = cache(async (topicId: string): Promise<Note[]> => {
  await connection();
  if (!isSupabaseConfigured) return [];
  const { data, error } = await createPublicClient()
    .from("notes")
    .select("id, topic_id, title, body, published, sort_order, updated_at")
    .eq("topic_id", topicId)
    .eq("published", true)
    .order("sort_order");
  if (error) throw error;
  return data as Note[];
});

export const getQuestions = cache(async (topicIds: string[]): Promise<Question[]> => {
  await connection();
  if (!isSupabaseConfigured || topicIds.length === 0) return [];
  const { data, error } = await createPublicClient()
    .from("questions")
    .select("id, topic_id, stem, options, correct_index, explanation, source, published")
    .in("topic_id", topicIds)
    .eq("published", true)
    .order("created_at");
  if (error) throw error;
  return data as Question[];
});

export type TopicStats = Record<string, { notes: number; questions: number }>;

/** Published note/question counts per topic, for "has content" hints across the site. */
export const getTopicStats = cache(async (): Promise<TopicStats> => {
  await connection();
  if (!isSupabaseConfigured) return {};
  const { data, error } = await createPublicClient()
    .from("topic_content_counts")
    .select("topic_id, notes, questions");
  if (error) {
    // The view comes from migrations/0002_topic_stats.sql; the site still works without it.
    console.warn("topic_content_counts unavailable:", error.message);
    return {};
  }
  return Object.fromEntries(
    data.map((r) => [r.topic_id, { notes: Number(r.notes), questions: Number(r.questions) }]),
  );
});

/** Totals for a set of topic ids (use with descendantIds to include sub-topics). */
export function sumStats(ids: string[], stats: TopicStats) {
  return ids.reduce(
    (acc, id) => {
      const s = stats[id];
      if (s) {
        acc.notes += s.notes;
        acc.questions += s.questions;
      }
      return acc;
    },
    { notes: 0, questions: 0 },
  );
}

export const countQuestions = cache(async (topicIds: string[]): Promise<number> => {
  await connection();
  if (!isSupabaseConfigured || topicIds.length === 0) return 0;
  const { count, error } = await createPublicClient()
    .from("questions")
    .select("id", { count: "exact", head: true })
    .in("topic_id", topicIds)
    .eq("published", true);
  if (error) throw error;
  return count ?? 0;
});

// ───────────────────────── Tree helpers ─────────────────────────

export function buildTree(topics: Topic[]): TopicNode[] {
  const nodes = new Map<string, TopicNode>(topics.map((t) => [t.id, { ...t, children: [] }]));
  const roots: TopicNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parent_id ? nodes.get(node.parent_id) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  const sort = (list: TopicNode[]) => {
    list.sort((a, b) => a.sort_order - b.sort_order);
    list.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

/** Reading order: parents first, then their children — used for prev/next links. */
export function flattenTree(nodes: TopicNode[]): TopicNode[] {
  return nodes.flatMap((n) => [n, ...flattenTree(n.children)]);
}

/** A topic plus all of its descendants' ids — used to pool practice questions. */
export function descendantIds(topics: Topic[], rootId: string): string[] {
  const ids = [rootId];
  for (let i = 0; i < ids.length; i++) {
    for (const t of topics) if (t.parent_id === ids[i]) ids.push(t.id);
  }
  return ids;
}

/** Ancestors from the top down, for breadcrumbs. */
export function ancestors(topics: Topic[], topic: Topic): Topic[] {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const chain: Topic[] = [];
  let cur = topic.parent_id ? byId.get(topic.parent_id) : undefined;
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
  }
  return chain;
}

// ───────────────────────── Local fallback ─────────────────────────

const local = (() => {
  const subjects: Subject[] = [];
  const topics: Topic[] = [];

  syllabus.forEach((s, i) => {
    subjects.push({
      id: s.slug,
      slug: s.slug,
      exam: "bcs",
      lang: s.lang,
      title: s.title,
      marks: s.marks,
      sort_order: i,
      sources: s.sources ?? [],
      source_note: s.source_note ?? null,
    });
    const walk = (list: SeedTopic[], parentId: string | null) =>
      list.forEach((t, j) => {
        const id = `${s.slug}/${t.slug}`;
        topics.push({
          id,
          subject_id: s.slug,
          parent_id: parentId,
          slug: t.slug,
          title: t.title,
          description: t.description ?? null,
          points: t.points ?? [],
          marks: t.marks ?? null,
          sort_order: j,
        });
        walk(t.children ?? [], id);
      });
    walk(s.topics, null);
  });

  return { subjects, topics };
})();
