import { slugify } from "@/lib/utils";
import { FolderValidationResult } from "@/types/folder.types";

export function validateFolderName(
  value: FormDataEntryValue | null,
): FolderValidationResult {

  if (typeof value !== "string") {
    return {
      success: false,
      error: "Folder name is required.",
    };
  }

  const name = value.trim();

  if (name.length < 1 || name.length > 80) {
    return {
      success: false,
      error: "Folder name must be between 1 and 80 characters.",
    };
  }

  const slug = slugify(name);

  if (!slug) {
    return {
      success: false,
      error: "Folder name must contain letters or numbers.",
    };
  }

  return {
    success: true,
    data: { name, slug },
  };
}