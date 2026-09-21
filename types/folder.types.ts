import { ExplorerNote } from "./notes.types";

export type FolderValidationResult =
  | {
      success: true;
      data: {
        name: string;
        slug: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export type ExplorerFolder = {
  id: string;
  name: string;
  slug: string;
  children: ExplorerFolder[];
  notes: ExplorerNote[];
};

//scripts/import-obsidian.ts
export type ImportedFolder = {
  sourcePath: string;
  name: string;
  slug: string;
};

export type FolderRowProps = {
  id: number;
  name: string;
  slug: string;
};
