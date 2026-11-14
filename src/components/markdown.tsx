import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackToList } from "./back-to-list";
import { PracticeList, type PracticeItem } from "./practice-list";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return Children.toArray(node).map(textOf).join("");
}

/** "1. Anomaly" → "1-anomaly", so notes can link to their own headings with #anchors. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
};

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

/**
 * A "## Practice: …" heading followed by a "**1.** [Word](#anchor) · …" line marks a
 * self-test word list. Split it out so it can toggle between the English words and the
 * Bangla meanings (read from each "### N. Word" entry's "*pos* — **বাংলা**" line).
 */
function splitPractice(body: string) {
  const lines = body.split("\n");
  const h = lines.findIndex((l) => /^## Practice:/.test(l));
  const l = lines.findIndex((x, i) => i > h && /^\*\*\d+\.\*\* \[/.test(x));
  if (h < 0 || l < 0) return null;

  const bn = new Map<string, string>();
  for (const m of body.matchAll(/^### (\d+)\. .+\n\*[^*\n]+\* — \*\*([^*\n]+)\*\*/gm)) bn.set(m[1], m[2]);
  const items: PracticeItem[] = [...lines[l].matchAll(/\*\*(\d+)\.\*\* \[([^\]]+)\]\(#([^)]+)\)/g)].map((m) => ({
    n: m[1],
    word: m[2],
    anchor: m[3],
    bn: bn.get(m[1]),
  }));

  return {
    targetId: slugify(lines[h].slice(3)),
    before: lines.slice(0, h + 1).join("\n"),
    intro: lines.slice(h + 1, l).join("\n"),
    items,
    after: lines.slice(l + 1).join("\n"),
  };
}

export function Markdown({ children }: { children: string }) {
  const practice = splitPractice(children);
  if (!practice) {
    return (
      <div className="prose-note">
        <Md>{children}</Md>
      </div>
    );
  }
  return (
    <div className="prose-note">
      <Md>{practice.before}</Md>
      <PracticeList items={practice.items}>
        <Md>{practice.intro}</Md>
      </PracticeList>
      <Md>{practice.after}</Md>
      <BackToList targetId={practice.targetId} label="শব্দতালিকায় ফিরুন" />
    </div>
  );
}
