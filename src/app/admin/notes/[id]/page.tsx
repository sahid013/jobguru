import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorClient } from "@/lib/auth";
import type { Note, Subject, Topic } from "@/lib/types";
import { NoteForm } from "../note-form";

export default async function EditNotePage({ params }: PageProps<"/admin/notes/[id]">) {
  const { id } = await params;
  const supabase = await getEditorClient();
  if (!supabase) return null;
  const { data: note } = await supabase
    .from("notes")
    .select("*, topic:topics(*, subject:subjects(*))")
    .eq("id", id)
    .maybeSingle<Note & { topic: Topic & { subject: Subject } }>();
  if (!note) notFound();

  const { topic } = note;
  return (
    <div>
      <Link href={`/admin/topics/${topic.id}`} className="text-sm text-muted hover:text-brand" lang={topic.subject.lang}>
        ← {topic.title}
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">নোট এডিট</h1>
      <NoteForm topicId={topic.id} lang={topic.subject.lang} note={note} />
    </div>
  );
}
