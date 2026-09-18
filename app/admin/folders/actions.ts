"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/auth-utils";
import { db } from "@/lib/db";

function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createFolder(formData: FormData) {
  // Authorization belongs in the mutation, not only in the page that renders it.
  await requireAdmin();

  const nameValue = formData.get("name");

  if (typeof nameValue !== "string") {
    throw new Error("Folder name is required.");
  }

  const name = nameValue.trim();

  if (name.length < 1 || name.length > 80) {
    throw new Error("Folder name must be between 1 and 80 characters.");
  }

  const slug = slugify(name);

  if (!slug) {
    throw new Error("Folder name must contain letters or numbers.");
  }

  const existingFolder = await db.orm.public.Folder.where({ slug }).first();

  if (existingFolder) {
    throw new Error("A folder with that name already exists.");
  }

  await db.orm.public.Folder.create({ name, slug });

  // The page reads from the database on the server, so invalidate its cached result.
  revalidatePath("/admin/folders");
}
