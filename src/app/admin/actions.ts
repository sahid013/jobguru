"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

const str = (f: FormData, key: string) => String(f.get(key) ?? "").trim();
const optStr = (f: FormData, key: string) => str(f, key) || null;
const optInt = (f: FormData, key: string) => {
  const v = str(f, key);
  return v === "" ? null : Number.parseInt(v, 10);
};

function slugify(title: string) {
  const s = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Bangla titles have no Latin letters — fall back to a short unique id.
  return s || `t-${Date.now().toString(36)}`;
}

/** Public pages are cached; expire them so the change shows up immediately. */
function refreshPublic() {
  updateTag(CONTENT_TAG);
}

async function db() {
  const editor = await requireEditor();
  return { supabase: await createClient(), userId: editor.user.id };
}

function fail(message: string): never {
  throw new Error(message);
}

// ───────────────────────── Topics ─────────────────────────

export async function createTopic(form: FormData) {
  const { supabase } = await db();
  const title = str(form, "title");
  if (!title) fail("Title is required");

  const subjectId = str(form, "subject_id");
  const parentId = optStr(form, "parent_id");
  const { count } = await supabase
    .from("topics")
    .select("id", { count: "exact", head: true })
    .eq("subject_id", subjectId)
    .is("parent_id", parentId);

  const points = str(form, "points")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const { error } = await supabase.from("topics").insert({
    subject_id: subjectId,
    parent_id: parentId,
    title,
    slug: str(form, "slug") ? slugify(str(form, "slug")) : slugify(title),
    description: optStr(form, "description"),
    points,
    marks: optInt(form, "marks"),
    sort_order: count ?? 0,
  });
  if (error) fail(error.message);
  refreshPublic();
}

export async function deleteTopic(form: FormData) {
  const { supabase } = await db();
  const { error } = await supabase.from("topics").delete().eq("id", str(form, "id"));
  if (error) fail(error.message);
  refreshPublic();
  redirect("/admin");
}

// ───────────────────────── Notes ─────────────────────────

export async function saveNote(form: FormData) {
  const { supabase, userId } = await db();
  const id = optStr(form, "id");
  const topicId = str(form, "topic_id");
  const row = {
    topic_id: topicId,
    title: str(form, "title"),
    body: String(form.get("body") ?? ""),
    published: form.get("published") === "on",
    sort_order: optInt(form, "sort_order") ?? 0,
  };
  if (!row.title) fail("Title is required");

  const { error } = id
    ? await supabase.from("notes").update(row).eq("id", id)
    : await supabase.from("notes").insert({ ...row, author_id: userId });
  if (error) fail(error.message);

  refreshPublic();
  redirect(`/admin/topics/${topicId}`);
}

export async function deleteNote(form: FormData) {
  const { supabase } = await db();
  const { error } = await supabase.from("notes").delete().eq("id", str(form, "id"));
  if (error) fail(error.message);
  refreshPublic();
}

// ───────────────────────── Questions ─────────────────────────

export async function createQuestion(form: FormData) {
  const { supabase, userId } = await db();
  const topicId = str(form, "topic_id");
  const options = [0, 1, 2, 3, 4, 5].map((i) => str(form, `option_${i}`)).filter(Boolean);
  const correct = Number.parseInt(str(form, "correct_index"), 10);

  if (!str(form, "stem")) fail("Question is required");
  if (options.length < 2) fail("At least two options are required");
  if (!(correct >= 0 && correct < options.length)) fail("Pick the correct option");

  const { error } = await supabase.from("questions").insert({
    topic_id: topicId,
    stem: str(form, "stem"),
    options,
    correct_index: correct,
    explanation: optStr(form, "explanation"),
    source: optStr(form, "source"),
    author_id: userId,
  });
  if (error) fail(error.message);

  refreshPublic();
}

export async function deleteQuestion(form: FormData) {
  const { supabase } = await db();
  const { error } = await supabase.from("questions").delete().eq("id", str(form, "id"));
  if (error) fail(error.message);
  refreshPublic();
}

/** For content added outside the dashboard (SQL Editor, imports): make it visible now. */
export async function refreshSite() {
  await requireEditor();
  refreshPublic();
}

// ───────────────────────── Session ─────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
