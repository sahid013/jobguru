import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackToList } from "./back-to-list";
import { FIGURES } from "./figures";
import { NoteLang, PracticeList, type PracticeItem } from "./practice-list";

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
  // ```figure\nname\n``` embeds one of the hand-drawn diagrams; other code blocks stay code.
  pre: ({ children }) => {
    const code = Children.toArray(children)[0];
    if (isValidElement<{ className?: string; children?: ReactNode }>(code) && code.props.className === "language-figure") {
      const Fig = FIGURES[textOf(code.props.children).trim()];
      if (Fig) return <Fig />;
    }
    return <pre>{children}</pre>;
  },
  // Wide tables scroll inside their own frame instead of the page.
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

function Md({ children, using = components }: { children: string; using?: Components }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={using}>
      {children}
    </ReactMarkdown>
  );
}

/** Both copies are rendered; CSS shows the one matching the note's language toggle. */
function Swap({ en, bn }: { en: ReactNode; bn: ReactNode }) {
  return (
    <>
      <span className="show-en">{en}</span>
      <span className="show-bn">{bn}</span>
    </>
  );
}

/**
 * In Bangla mode an entry reads Bangla → English: "### 1. Anomaly" shows the Bangla meaning,
 * and the "**বাংলা**" meaning line shows "Anomaly". Ids stay English so anchors keep working.
 */
function entryComponents(items: PracticeItem[]): Components {
  const byN = new Map(items.map((it) => [it.n, it]));
  const byBn = new Map(items.filter((it) => it.bn).map((it) => [it.bn!, it.word]));
  return {
    ...components,
    h3: ({ children }) => {
      const text = textOf(children);
      const item = byN.get(text.match(/^(\d+)\. /)?.[1] ?? "");
      return (
        <h3 id={slugify(text)}>{item?.bn ? <Swap en={children} bn={`${item.n}. ${item.bn}`} /> : children}</h3>
      );
    },
    strong: ({ children }) => {
      const word = byBn.get(textOf(children));
      return <strong>{word ? <Swap en={children} bn={word} /> : children}</strong>;
    },
  };
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
    <NoteLang>
      <Md>{practice.before}</Md>
      <PracticeList items={practice.items}>
        <Md>{practice.intro}</Md>
      </PracticeList>
      <Md using={entryComponents(practice.items)}>{practice.after}</Md>
      <BackToList targetId={practice.targetId} label="শব্দতালিকায় ফিরুন" />
    </NoteLang>
  );
}
