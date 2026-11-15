"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type PracticeItem = { n: string; word: string; bn?: string; anchor: string };
type Lang = "en" | "bn";

const LANGS = [
  { id: "en", label: "English" },
  { id: "bn", label: "বাংলা" },
] as const;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

/**
 * Wraps a note that has a practice list. In "bn" mode the whole note flips: the list and each
 * entry's heading show the Bangla meaning, and the English word moves into its place (CSS in
 * globals.css hides whichever `.show-en` / `.show-bn` copy doesn't match `data-lang`).
 */
export function NoteLang({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="prose-note" data-lang={lang}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

/** A note's self-test word list with an English ↔ Bangla toggle. Each item jumps to its entry. */
export function PracticeList({ items, children }: { items: PracticeItem[]; children?: ReactNode }) {
  const { lang, setLang } = useContext(LangContext);

  return (
    <div>
      <div role="group" aria-label="Language" className="inline-flex rounded-lg border border-line p-0.5 text-sm">
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-pressed={lang === l.id}
            onClick={() => setLang(l.id)}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              lang === l.id ? "bg-brand text-brand-ink" : "text-muted hover:bg-surface-2"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      {children}
      <p lang={lang}>
        {items.map((item, i) => (
          <span key={item.anchor}>
            {i > 0 && " · "}
            <a href={`#${item.anchor}`}>{lang === "bn" ? (item.bn ?? item.word) : item.word}</a>
          </span>
        ))}
      </p>
    </div>
  );
}
