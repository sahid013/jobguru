import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { BackToList } from "./back-to-list";

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

export function Markdown({ children }: { children: string }) {
  // A "## Practice: …" heading marks a self-test word list; give it a floating way back.
  const practice = children.match(/^## (Practice:.*)$/m)?.[1];
  return (
    <div className="prose-note">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
      {practice && <BackToList targetId={slugify(practice)} label="শব্দতালিকায় ফিরুন" />}
    </div>
  );
}
