import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { descendantIds, sumStats, type TopicStats } from "@/lib/data";
import type { Lang, Topic, TopicNode } from "@/lib/types";
import { ContentCounts } from "./content-counts";
import { MarksBadge } from "./ui";

/** Syllabus topics as rows, with nested sub-topics shown inline and content hints on every row. */
export function TopicList({
  nodes,
  lang,
  subjectSlug,
  topics,
  stats,
  depth = 0,
}: {
  nodes: TopicNode[];
  lang: Lang;
  subjectSlug: string;
  topics: Topic[];
  stats: TopicStats;
  depth?: number;
}) {
  return (
    <ul className={depth === 0 ? "divide-y divide-line" : "mt-3 space-y-3 border-l-2 border-line pl-4"}>
      {nodes.map((node) => {
        const totals = sumStats(descendantIds(topics, node.id), stats);
        return (
          <li key={node.id} className={depth === 0 ? "px-5 py-4" : ""}>
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/subjects/${subjectSlug}/${node.slug}`}
                className={`group inline-flex items-center gap-1.5 hover:text-brand ${
                  depth === 0 ? "text-xl font-semibold" : "font-semibold"
                }`}
              >
                {node.title}
                <ChevronRight
                  className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden
                />
              </Link>
              <span className="flex shrink-0 items-center gap-3">
                <ContentCounts lang={lang} notes={totals.notes} questions={totals.questions} />
                {node.marks != null && <MarksBadge lang={lang} marks={node.marks} />}
              </span>
            </div>
            {node.description && <p className="mt-1 text-muted">{node.description}</p>}
            {node.points.length > 0 && (
              <ul className="mt-1.5 space-y-1 list-[circle] pl-6 text-muted">
                {node.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            {node.children.length > 0 && (
              <TopicList
                nodes={node.children}
                lang={lang}
                subjectSlug={subjectSlug}
                topics={topics}
                stats={stats}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
