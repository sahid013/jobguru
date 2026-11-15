"use client";

import { ArrowLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { TopicStats } from "@/lib/data";
import type { Lang, TopicNode } from "@/lib/types";
import { ContentCounts } from "./content-counts";
import { Collapse, Rotate, spring } from "./motion";

type Props = {
  subjectSlug: string;
  subjectTitle: string;
  examHref: string;
  lang: Lang;
  tree: TopicNode[];
  stats: TopicStats;
  labels: { overview: string; contents: string; allSubjects: string };
};

export function SubjectSidebar({ subjectSlug, subjectTitle, examHref, lang, tree, stats, labels }: Props) {
  const pathname = usePathname();
  const base = `/subjects/${subjectSlug}`;
  // /subjects/<subject>/<topic>[/practice] gives the active topic slug
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

  // Rendered twice (phone panel + desktop sidebar); each copy gets its own
  // LayoutGroup so the sliding highlight doesn't jump between them.
  const nav = (group: string) => (
    <LayoutGroup id={group}>
      <nav lang={lang} className="text-[0.95rem]">
        <Link
          href={base}
          className={`relative flex items-center gap-2 rounded-lg px-3 py-2 font-semibold transition-colors ${
            activeSlug === null ? "text-brand-ink" : "hover:bg-surface-2"
          }`}
        >
          {activeSlug === null && <ActivePill solid />}
          <LayoutDashboard className="relative size-4" strokeWidth={2.2} aria-hidden />
          <span className="relative">{labels.overview}</span>
        </Link>
        {tree.length > 0 && <div className="my-2 border-t border-line" />}
        <Tree nodes={tree} base={base} lang={lang} stats={stats} activeSlug={activeSlug} isOpen={isOpen} toggle={toggle} />
      </nav>
    </LayoutGroup>
  );

  return (
    <aside className="mb-6 lg:mb-0">
      {/* Phones and tablets: a bar that shows where you are and opens the list */}
      <div className="lg:hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_#034e3a0a]">
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
          <Rotate open={mobileOpen}>
            <ChevronRight className="size-5 text-muted" aria-hidden />
          </Rotate>
        </button>
        <Collapse open={mobileOpen}>
          <div className="border-t border-line p-2">{nav("mobile")}</div>
        </Collapse>
      </div>

      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[20px] border border-line bg-surface p-2.5 shadow-[0_1px_2px_#034e3a0a,0_12px_32px_#034e3a0d]">
        <Link
          href={examHref}
          className="group inline-flex items-center gap-1 px-3 pt-1 text-xs text-muted hover:text-brand"
          lang={lang}
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          {labels.allSubjects}
        </Link>
        <p className="font-display px-3 pt-2 pb-2 text-lg leading-snug text-heading" lang={lang}>
          {subjectTitle}
        </p>
        {nav("desktop")}
      </div>
    </aside>
  );
}

/** The highlight behind the selected item; it slides to the new item on navigation. */
function ActivePill({ solid }: { solid?: boolean }) {
  return (
    <motion.span
      layoutId="active-pill"
      transition={spring}
      className={`absolute inset-0 rounded-lg ${solid ? "bg-brand" : "bg-brand-soft"}`}
      aria-hidden
    />
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
    <ul className={depth > 0 ? "ml-3 mt-0.5 space-y-0.5 border-l border-line pl-2" : "space-y-0.5"}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const open = hasChildren && isOpen(node.id);
        const active = node.slug === activeSlug;
        const totals = subtreeTotals(node, stats);
        return (
          <li key={node.id}>
            <div
              className={`relative flex items-center rounded-lg transition-colors ${
                active ? "text-brand font-semibold" : "hover:bg-surface-2"
              }`}
            >
              {active && <ActivePill />}
              <Link
                href={`${base}/${node.slug}`}
                onClick={() => {
                  if (hasChildren && !open) toggle(node.id);
                }}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-1 min-w-0 items-center gap-2 px-3 py-1.5 leading-snug"
              >
                <span className="min-w-0 flex-1">{node.title}</span>
                <ContentCounts lang={lang} notes={totals.notes} questions={totals.questions} className="shrink-0" />
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggle(node.id)}
                  aria-expanded={open}
                  aria-label={node.title}
                  className="relative shrink-0 grid place-items-center size-8 rounded-md text-muted hover:text-ink hover:bg-surface-2/80"
                >
                  <Rotate open={open}>
                    <ChevronRight className="size-4" aria-hidden />
                  </Rotate>
                </button>
              )}
            </div>
            {hasChildren && (
              <Collapse open={open}>
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
              </Collapse>
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
