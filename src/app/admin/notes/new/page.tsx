import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorClient } from "@/lib/auth";
import type { Subject, Topic } from "@/lib/types";
import { NoteForm } from "../note-form";

export default async function NewNotePage({ searchParams }: PageProps<"/admin/notes/new">) {
  const { topic: topicId } = await searchParams;
  if (typeof topicId !== "string") notFound();

  const supabase = await getEditorClient();
  if (!supabase) return null;
  const { data: topic } = await supabase
    .from("topics")
    .select("*, subject:subjects(*)")
    .eq("id", topicId)
    .maybeSingle<Topic & { subject: Subject }>();
  if (!topic) notFound();

  return (
    <div>
      <Link href={`/admin/topics/${topic.id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand" lang={topic.subject.lang}>
        <ArrowLeft className="size-4" aria-hidden />
        {topic.title}
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">নতুন নোট</h1>
      <NoteForm topicId={topic.id} lang={topic.subject.lang} />
    </div>
  );
}
