"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Lang, Note } from "@/lib/types";
import { saveNote } from "../actions";
import { Field, SubmitButton, inputClass } from "../form-ui";

export function NoteForm({ topicId, lang, note }: { topicId: string; lang: Lang; note?: Note }) {
  const [body, setBody] = useState(note?.body ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={saveNote} className="space-y-4">
      {note && <input type="hidden" name="id" value={note.id} />}
      <input type="hidden" name="topic_id" value={topicId} />

      <Field label="টাইটেল *">
        <input name="title" required defaultValue={note?.title} className={inputClass} lang={lang} />
      </Field>

      <div>
        <div className="flex items-center gap-1 text-sm">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-t-md px-3 py-1.5 ${tab === t ? "bg-surface border border-b-0 border-line font-semibold" : "text-muted"}`}
            >
              {t === "write" ? "লিখুন" : "প্রিভিউ"}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted">Markdown সমর্থিত: **bold**, # শিরোনাম, - তালিকা, | টেবিল |</span>
        </div>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={20}
          lang={lang}
          className={`${inputClass} mt-0 rounded-tl-none font-mono text-[0.95rem] leading-relaxed ${tab === "write" ? "" : "hidden"}`}
        />
        {tab === "preview" && (
          <div className="prose-note min-h-80 rounded-lg rounded-tl-none border border-line bg-surface px-5 py-4" lang={lang}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || "_কিছু লেখা হয়নি_"}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={note?.published ?? true} className="size-4 accent-brand" />
          <span>প্রকাশিত (সবাই দেখতে পাবে)</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          ক্রম
          <input
            name="sort_order"
            type="number"
            defaultValue={note?.sort_order ?? 0}
            className={`${inputClass} mt-0 w-20`}
          />
        </label>
      </div>

      <SubmitButton>{note ? "সংরক্ষণ করুন" : "নোট যোগ করুন"}</SubmitButton>
    </form>
  );
}
