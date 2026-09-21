export type NoteValidationResult =
  | {
      success: true;
      data: {
        title: string;
        slug: string;
        content: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export type ExplorerNote = {
  id: string;
  title: string;
  slug: string;
  folderId: string;
};

//scripts/import-obsidian.ts
export type ImportedNote = {
  sourcePath: string;
  filename: string;
  folderPath: string | null;

  title: string;
  slug: string;

  frontmatter: Record<string, unknown>;
  content: string;

  isMoc: boolean;
};

export type ValidationIssue = {
  level: "error" | "warning";
  message: string;
};

export type NoteEditFormProps = {
  content: string;
  folderId: number | null;
  originalSlug: string;
  published: boolean;
  title: string;
};
