import "server-only";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth-utils";

export async function getNotes() {
  return db.orm.public.Note.where((note) => note.publishedAt.isNotNull())
    .include("folder", (folder) =>
      folder.where((folder) => folder.publishedAt.isNotNull()),
    )
    .orderBy((note) => note.createdAt.desc())
    .all();
}

export async function getNoteBySlug(slug: string) {
  return db.orm.public.Note.where({ slug })
    .where((note) => note.publishedAt.isNotNull())
    .include("folder", (folder) =>
      folder.where((folder) => folder.publishedAt.isNotNull()),
    )
    .first();
}

export async function getAdminNotes() {
  await requireAdmin();

  return db.orm.public.Note.include("folder")
    .orderBy((note) => note.createdAt.desc())
    .all();
}

export async function getAdminNoteBySlug(slug: string) {
  await requireAdmin();

  return db.orm.public.Note.where({ slug }).include("folder").first();
}
