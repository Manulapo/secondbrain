"use server";

import { requireAdmin } from "@/lib/auth/auth-utils";
import { db } from "@/lib/db";
import {
  getFolderId,
  isPublished,
  revalidateNotePaths,
  validateNote,
  validateNoteTitle,
} from "@/lib/notes/helpers";
import { ensureFolderExists } from "../folders/actions";

export async function createNote(formData: FormData) {
  await requireAdmin();

  const hasContent = formData.has("content");
  const result = validateNote(
    formData.get("title"),
    hasContent ? formData.get("content") : formData.get("title"),
  );

  if (!result.success) {
    throw new Error(result.error);
  }

  const { title, slug } = result.data;
  const content = hasContent ? result.data.content : "";
  const folderId = getFolderId(formData);

  const existingNote = await db.orm.public.Note.where({ slug }).first();

  if (existingNote) {
    throw new Error("A note with that title already exists.");
  }

  await ensureFolderExists(folderId);

  await db.orm.public.Note.create({
    title,
    slug,
    content,
    folderId,
    publishedAt: isPublished(formData) ? new Date().toISOString() : null,
  });

  revalidateNotePaths(slug);

  return { slug };
}

export async function updateNote(formData: FormData) {
  await requireAdmin();

  const originalSlug = formData.get("slug");

  if (typeof originalSlug !== "string" || !originalSlug.trim()) {
    throw new Error("Invalid note.");
  }

  const result = validateNote(formData.get("title"), formData.get("content"));

  if (!result.success) {
    throw new Error(result.error);
  }

  const { title, slug: newSlug, content } = result.data;
  const note = await db.orm.public.Note.where({ slug: originalSlug }).first();

  if (!note) {
    throw new Error("Note does not exist.");
  }

  if (newSlug !== originalSlug) {
    const conflictingNote = await db.orm.public.Note.where({
      slug: newSlug,
    }).first();

    if (conflictingNote) {
      throw new Error("A note with that title already exists.");
    }
  }

  const folderId = getFolderId(formData);
  await ensureFolderExists(folderId);

  await db.orm.public.Note.where({ id: note.id }).update({
    title,
    slug: newSlug,
    content,
    folderId,
    publishedAt: isPublished(formData)
      ? (note.publishedAt ?? new Date().toISOString())
      : null,
  });

  revalidateNotePaths(originalSlug);
  revalidateNotePaths(newSlug);

  return { content, slug: newSlug, title };
}

export async function renameNote(formData: FormData) {
  await requireAdmin();

  const originalSlugValue = formData.get("slug");
  if (typeof originalSlugValue !== "string" || !originalSlugValue.trim()) {
    throw new Error("Invalid note.");
  }
  const originalSlug = originalSlugValue.trim();

  const result = validateNoteTitle(formData.get("title"));
  if (!result.success) throw new Error(result.error);

  const { title, slug: newSlug } = result.data;
  const note = await db.orm.public.Note.where({ slug: originalSlug }).first();
  if (!note) throw new Error("Note does not exist.");

  if (newSlug !== originalSlug) {
    const conflictingNote = await db.orm.public.Note.where({
      slug: newSlug,
    }).first();
    if (conflictingNote) {
      throw new Error("A note with that title already exists.");
    }
  }

  await db.orm.public.Note.where({ id: note.id }).update({
    title,
    slug: newSlug,
  });

  revalidateNotePaths(originalSlug);
  revalidateNotePaths(newSlug);

  return { slug: newSlug, title };
}

export async function deleteNote(formData: FormData) {
  await requireAdmin();

  const slugValue = formData.get("slug");

  if (typeof slugValue !== "string" || !slugValue.trim()) {
    throw new Error("Note title is required.");
  }

  const slug = slugValue.trim();
  const existingNote = await db.orm.public.Note.where({ slug }).first();

  if (!existingNote) {
    throw new Error("A note with that title does not exist.");
  }

  await db.orm.public.Note.where({ id: existingNote.id }).delete();

  revalidateNotePaths(slug);
}
