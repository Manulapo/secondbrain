"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/auth-utils";
import { db } from "@/lib/db";
import { validateFolderName } from "@/lib/folders/helpers";

export async function createFolder(formData: FormData) {
  await requireAdmin();

  const result = validateFolderName(formData.get("name"));

  if (!result.success) {
    throw new Error(result.error);
  }

  const { name, slug } = result.data;

  const existingFolder = await db.orm.public.Folder.where({ slug }).first();

  if (existingFolder) {
    throw new Error("A folder with that name already exists.");
  }

  await db.orm.public.Folder.create({ name, slug });

  revalidatePath("/admin/folders");
  revalidatePath("/", "layout");
}

export async function updateFolder(formData: FormData) {
  await requireAdmin();

  const originalSlug = formData.get("slug");

  if (typeof originalSlug !== "string" || !originalSlug.trim()) {
    throw new Error("Invalid folder.");
  }

  const result = validateFolderName(formData.get("name"));

  if (!result.success) {
    throw new Error(result.error);
  }

  const { name, slug: newSlug } = result.data;

  const folder = await db.orm.public.Folder
    .where({ slug: originalSlug })
    .first();

  if (!folder) {
    throw new Error("Folder does not exist.");
  }

  // if the slug changed, make sure another folder doesn't already use it
  if (newSlug !== originalSlug) {
    const conflictingFolder = await db.orm.public.Folder
      .where({ slug: newSlug })
      .first();

    if (conflictingFolder) {
      throw new Error("A folder with that name already exists.");
    }
  }

  await db.orm.public.Folder
    .where({ id: folder.id })
    .update({
      name,
      slug: newSlug,
    });

  revalidatePath("/admin/folders");
  revalidatePath("/", "layout");

  return { slug: newSlug };
}

export async function deleteFolder(formData: FormData) {
  await requireAdmin();

  const slugValue = formData.get("slug");

  if (typeof slugValue !== "string" || !slugValue.trim()) {
    throw new Error("Folder name is required.");
  }

  const slug = slugValue.trim();

  const existingFolder = await db.orm.public.Folder.where({ slug }).first();

  if (!existingFolder) {
    throw new Error("A folder with that name does not exist.");
  }

  await db.orm.public.Folder.where({ id: existingFolder.id }).delete();

  revalidatePath("/admin/folders");
  revalidatePath("/", "layout");
}

export async function ensureFolderExists(folderId: number | null) {
  if (folderId === null) {
    return;
  }

  const folder = await db.orm.public.Folder.where({ id: folderId }).first();

  if (!folder) {
    throw new Error("Folder does not exist.");
  }
}
