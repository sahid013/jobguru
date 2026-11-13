import Link from "next/link";
import type { Lang, TopicNode } from "@/lib/types";
import { MarksBadge } from "./ui";

/** Syllabus topics as cards, with nested sub-topics shown inline. */
export function TopicList({
  nodes,
  lang,
  subjectSlug,
  depth = 0,
}: {
  nodes: TopicNode[];
  lang: Lang;
  subjectSlug: string;
  depth?: number;
}) {
  return (
    <ul className={depth === 0 ? "divide-y divide-line" : "mt-3 space-y-3 border-l-2 border-line pl-4"}>
      {nodes.map((node) => (
        <li key={node.id} className={depth === 0 ? "px-5 py-4" : ""}>
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/subjects/${subjectSlug}/${node.slug}`}
              className={`hover:text-brand hover:underline underline-offset-4 ${
                depth === 0 ? "text-xl font-semibold" : "font-semibold"
              }`}
            >
              {node.title}
            </Link>
            {node.marks != null && <MarksBadge lang={lang} marks={node.marks} />}
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
            <TopicList nodes={node.children} lang={lang} subjectSlug={subjectSlug} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}
