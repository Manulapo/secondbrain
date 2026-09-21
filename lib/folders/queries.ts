import "server-only"; // Internal server-side code that must never be imported by client code

import { db } from "@/lib/db";
import { requireAdmin } from "../auth/auth-utils";

export async function getFolders() {
  return await db.orm.public.Folder.where((folder) =>
    folder.publishedAt.isNotNull(),
  )
    .include("notes", (notes) =>
      notes
        .where((note) => note.publishedAt.isNotNull())
        .select("title", "createdAt", "id", "slug")
        .orderBy((note) => note.createdAt.desc()),
    )
    .all();
}

export async function getExplorerFolders() {
  return db.orm.public.Folder.where((folder) => folder.publishedAt.isNotNull())
    .select("id", "name", "slug", "parentFolderId")
    .include("notes", (notes) =>
      notes
        .where((note) => note.publishedAt.isNotNull())
        .select("id", "title", "slug", "folderId")
        .orderBy((note) => note.title.asc()),
    )
    .orderBy((folder) => folder.name.asc())
    .all();
}

export async function getAdminExplorerFolders() {
  await requireAdmin();

  return db.orm.public.Folder.select("id", "name", "slug", "parentFolderId")
    .include("notes", (notes) =>
      notes
        .select("id", "title", "slug", "folderId")
        .orderBy((note) => note.title.asc()),
    )
    .orderBy((folder) => folder.name.asc())
    .all();
}

export async function getFolderBySlug(slug: string) {
  return await db.orm.public.Folder.where({ slug })
    .where((folder) => folder.publishedAt.isNotNull())
    .where((folder) =>
      folder.notes.some((note) => note.publishedAt.isNotNull()),
    )
    .include(
      "notes",
      (notes) =>
        notes
          .where((note) => note.publishedAt.isNotNull())
          .orderBy((note) => note.title.asc()), // alphabetical order
    )
    .include("parent", (parentFolder) =>
      parentFolder
        .where((parent) => parent.publishedAt.isNotNull())
        .where((parent) =>
          parent.notes.some((note) => note.publishedAt.isNotNull()),
        ),
    )
    .include("children", (subFolders) =>
      // include children folders and their notes
      subFolders
        .where((subfolder) => subfolder.publishedAt.isNotNull())
        .where((subFolder) =>
          subFolder.notes.some((note) => note.publishedAt.isNotNull()),
        )
        .orderBy((child) => child.name.asc()),
    )
    .first();
}

export async function getAdminFolders() {
  await requireAdmin();
  return db.orm.public.Folder.include("notes", (notes) =>
    notes
      .select("title", "createdAt", "id", "slug")
      .orderBy((note) => note.createdAt.desc()),
  )
    .orderBy((folder) => folder.name.asc())
    .all();
}

export async function getAdminFolderBySlug(slug: string) {
  await requireAdmin();
  return db.orm.public.Folder.where({ slug })
    .include("notes", (notes) => notes.orderBy((note) => note.title.asc()))
    .include("parent", (parentFolder) =>
      parentFolder.orderBy((parent) => parent.name.asc()),
    )
    .include("children", (subFolders) =>
      subFolders.orderBy((child) => child.name.asc()),
    )
    .first();
}
