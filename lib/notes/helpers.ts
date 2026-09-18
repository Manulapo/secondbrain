import { slugify } from "@/lib/utils";
import { NoteValidationResult } from "@/types/notes.types";
import { revalidatePath } from "next/cache";

export function revalidateNotePaths(slug?: string) {
  revalidatePath("/admin/notes");
  revalidatePath("/notes");

  if (slug) {
    revalidatePath(`/notes/${slug}`);
  }
}

export function getFolderId(formData: FormData) {
  const value = formData.get("folderId");

  if (value === null || (typeof value === "string" && !value.trim())) {
    return null;
  }

  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw new Error("Invalid folder.");
  }

  const folderId = Number(value);

  if (!Number.isSafeInteger(folderId) || folderId < 1) {
    throw new Error("Invalid folder.");
  }

  return folderId;
}

export function isPublished(formData: FormData) {
  const value = formData.get("published");
  return value === "on" || value === "true";
}

export function validateNote(
  titleValue: FormDataEntryValue | null,
  contentValue: FormDataEntryValue | null,
): NoteValidationResult {
  if (typeof titleValue !== "string") {
    return { success: false, error: "Note title is required." };
  }

  const title = titleValue.trim();

  if (title.length < 1 || title.length > 120) {
    return {
      success: false,
      error: "Note title must be between 1 and 120 characters.",
    };
  }

  const slug = slugify(title);

  if (!slug) {
    return {
      success: false,
      error: "Note title must contain letters or numbers.",
    };
  }

  if (typeof contentValue !== "string" || !contentValue.trim()) {
    return { success: false, error: "Note content is required." };
  }

  return {
    success: true,
    data: { title, slug, content: contentValue },
  };
}
