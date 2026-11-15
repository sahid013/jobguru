export type Lang = "bn" | "en";

export type SourceGroup = { heading: string | null; items: string[] };

export type Subject = {
  id: string;
  slug: string;
  exam: string;
  lang: Lang;
  title: string;
  marks: number;
  sort_order: number;
  sources: SourceGroup[];
  source_note: string | null;
};

export type Topic = {
  id: string;
  subject_id: string;
  parent_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  points: string[];
  marks: number | null;
  sort_order: number;
};

export type TopicNode = Topic & { children: TopicNode[] };

export type Note = {
  id: string;
  topic_id: string;
  title: string;
  body: string;
  published: boolean;
  sort_order: number;
  updated_at: string;
};

export type Question = {
  id: string;
  topic_id: string;
  stem: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  source: string | null;
  published: boolean;
};
