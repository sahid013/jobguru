"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { TopicStats } from "@/lib/data";
import type { Lang, TopicNode } from "@/lib/types";
import { ContentCounts } from "./content-counts";

type Props = {
  subjectSlug: string;
  subjectTitle: string;
  lang: Lang;
  tree: TopicNode[];
  stats: TopicStats;
  labels: { overview: string; contents: string; allSubjects: string };
};

export function SubjectSidebar({ subjectSlug, subjectTitle, lang, tree, stats, labels }: Props) {
  const pathname = usePathname();
  const base = `/subjects/${subjectSlug}`;
  // /subjects/<subject>/<topic>[/practice] → the active topic slug
  const activeSlug = pathname.startsWith(`${base}/`) ? pathname.slice(base.length + 1).split("/")[0] : null;
  const activePath = activeSlug ? pathTo(tree, activeSlug) : [];
  const activeTitle = activeSlug ? findTitle(tree, activeSlug) : null;

  // Topics on the way to the selected one start open; the user can still toggle any of them.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => toggled[id] ?? activePath.includes(id);
  const toggle = (id: string) => setToggled((s) => ({ ...s, [id]: !isOpen(id) }));

  // The phone panel remembers which path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const mobileOpen = openOn === pathname;
  const setMobileOpen = (open: boolean) => setOpenOn(open ? pathname : null);

  const nav = (
    <nav lang={lang} className="text-[0.95rem]">
      <Link
        href={base}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-semibold ${
          activeSlug === null ? "bg-brand text-brand-ink" : "hover:bg-surface-2"
        }`}
      >
        <OverviewIcon />
        {labels.overview}
      </Link>
      {tree.length > 0 && <div className="my-2 border-t border-line" />}
      <Tree nodes={tree} base={base} lang={lang} stats={stats} activeSlug={activeSlug} isOpen={isOpen} toggle={toggle} />
    </nav>
  );

  return (
    <aside className="mb-6 lg:mb-0">
      {/* Phones and tablets: a bar that shows where you are and opens the list */}
      <div className="lg:hidden rounded-xl border border-line bg-surface">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          lang={lang}
        >
          <span className="min-w-0">
            <span className="block text-xs font-medium uppercase tracking-wide text-muted">{labels.contents}</span>
            <span className="block truncate font-semibold">{activeTitle ?? labels.overview}</span>
          </span>
          <Chevron open={mobileOpen} className="size-5" />
        </button>
        {mobileOpen && <div className="border-t border-line p-2">{nav}</div>}
      </div>

      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-line bg-surface p-2">
        <Link
          href="/#syllabus"
          className="flex items-center gap-1 px-3 pt-1 text-xs text-muted hover:text-brand"
          lang={lang}
        >
          <span aria-hidden>←</span> {labels.allSubjects}
        </Link>
        <p className="px-3 pt-2 pb-2 text-sm font-bold leading-snug" lang={lang}>
          {subjectTitle}
        </p>
        {nav}
      </div>
    </aside>
  );
}

function Tree({
  nodes,
  base,
  lang,
  stats,
  activeSlug,
  isOpen,
  toggle,
  depth = 0,
}: {
  nodes: TopicNode[];
  base: string;
  lang: Lang;
  stats: TopicStats;
  activeSlug: string | null;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  depth?: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-3 border-l border-line pl-2" : "space-y-0.5"}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const open = hasChildren && isOpen(node.id);
        const active = node.slug === activeSlug;
        const totals = subtreeTotals(node, stats);
        return (
          <li key={node.id}>
            <div
              className={`flex items-center rounded-lg ${
                active ? "bg-brand-soft text-brand font-semibold" : "hover:bg-surface-2"
              }`}
            >
              <Link
                href={`${base}/${node.slug}`}
                onClick={() => {
                  if (hasChildren && !open) toggle(node.id);
                }}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 min-w-0 items-center gap-2 px-3 py-1.5 leading-snug"
              >
                <span className="min-w-0 flex-1">{node.title}</span>
                <ContentCounts lang={lang} notes={totals.notes} questions={totals.questions} className="shrink-0" />
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggle(node.id)}
                  aria-expanded={open}
                  aria-label={node.title}
                  className="shrink-0 grid place-items-center size-8 rounded-md text-muted hover:text-ink"
                >
                  <Chevron open={open} />
                </button>
              )}
            </div>
            {open && (
              <Tree
                nodes={node.children}
                base={base}
                lang={lang}
                stats={stats}
                activeSlug={activeSlug}
                isOpen={isOpen}
                toggle={toggle}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Notes/questions in a topic and everything beneath it. */
function subtreeTotals(node: TopicNode, stats: TopicStats): { notes: number; questions: number } {
  const own = stats[node.id] ?? { notes: 0, questions: 0 };
  return node.children.reduce(
    (acc, c) => {
      const t = subtreeTotals(c, stats);
      return { notes: acc.notes + t.notes, questions: acc.questions + t.questions };
    },
    { ...own },
  );
}

/** Ids from the root down to the topic with this slug (inclusive), or [] if absent. */
function pathTo(nodes: TopicNode[], slug: string): string[] {
  for (const n of nodes) {
    if (n.slug === slug) return [n.id];
    const sub = pathTo(n.children, slug);
    if (sub.length) return [n.id, ...sub];
  }
  return [];
}

function findTitle(nodes: TopicNode[], slug: string): string | null {
  for (const n of nodes) {
    if (n.slug === slug) return n.title;
    const sub = findTitle(n.children, slug);
    if (sub) return sub;
  }
  return null;
}

function Chevron({ open, className = "size-4" }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={`${className} transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path d="M7.2 4.2a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.5 10 7.2 5.6a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="size-4">
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm0 6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Zm9-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-4Z" />
    </svg>
  );
}
