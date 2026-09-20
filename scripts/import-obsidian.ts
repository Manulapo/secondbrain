import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { ImportedNote, ValidationIssue } from "@/types/notes.types";
import { validateFolderName } from "../lib/folders/helpers";
import type { ImportedFolder } from "@/types/folder.types";
import { db } from "../lib/db";
import { validateNote } from "@/lib/notes/helpers";

const ROOT_FOLDER = "(root)";

type Database = typeof import("../lib/db").db;

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const markdownFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      const nestedFiles = await findMarkdownFiles(fullPath);
      markdownFiles.push(...nestedFiles);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

function createSlug(title: string): string {
  return title
    .replace(/^\d+\s*-\s*/, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function detectMoc(
  title: string,
  frontmatter: Record<string, unknown>,
): boolean {
  return frontmatter.type === "moc" || /^\d+\s*-\s*MOC\s*-/i.test(title);
}

async function parseNote(
  vaultPath: string,
  filePath: string,
): Promise<ImportedNote> {
  const rawContent = await readFile(filePath, "utf8");

  const parsed = matter(rawContent);

  const sourcePath = path.relative(vaultPath, filePath);
  const filename = path.basename(filePath);

  const relativeDirectory = path.dirname(sourcePath);

  const folderPath = relativeDirectory === "." ? null : relativeDirectory;

  const title = path.basename(filename, ".md");

  const frontmatter = parsed.data;

  return {
    sourcePath,
    filename,
    folderPath,
    title,
    slug: createSlug(title),
    frontmatter,
    content: parsed.content,
    isMoc: detectMoc(title, frontmatter),
  };
}

function groupBy<T>(items: T[], getKey: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const group = groups.get(key);

    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}

function getFolderLabel(note: ImportedNote): string {
  return note.folderPath ?? ROOT_FOLDER;
}

async function getDatabase(): Promise<Database> {
  return (await import("../lib/db")).db;
}

async function main() {
  const writeEnabled = process.argv.includes("--write");
  const vaultPath = process.argv[2];

  if (!vaultPath) {
    console.error(
      "Usage: npx tsx scripts/import-obsidian.ts /path/to/obsidian/vault",
    );
    process.exit(1);
  }

  const absoluteVaultPath = path.resolve(vaultPath);

  const vaultStats = await stat(absoluteVaultPath).catch(() => null);

  if (!vaultStats?.isDirectory()) {
    console.error(`Vault does not exist: ${absoluteVaultPath}`);
    process.exit(1);
  }

  const files = await findMarkdownFiles(absoluteVaultPath);

  files.sort();

  const notes = await Promise.all(
    files.map((file) => parseNote(absoluteVaultPath, file)),
  );

  printDryRun(notes);

  const issues = validateImport(notes);

  printValidationReport(notes, issues);

  const errors = issues.filter((issue) => issue.level === "error");

  if (errors.length > 0) {
    console.log("Import aborted because validation failed.");
    process.exit(1);
  }

  if (!writeEnabled) {
    console.log("\nDry run only. No database changes were made.");
    console.log("Run again with --write to perform the import.");
    return;
  }

  const folders = buildImportedFolders(notes);
  const database = await getDatabase();

  try {
    console.log("\nChecking database for folder conflicts...");

    await validateFoldersAgainstDatabase(database, folders);

    console.log("No folder conflicts found.\n");

    const folderIds = await importFolders(database, folders);

    console.log(
      `\nFolder import complete: ${folderIds.size} folders available.`,
    );

    console.log("\nChecking database for note conflicts...");

    await validateNotesAgainstDatabase(notes);

    console.log("No note conflicts found.\n");

    await importNotes(notes, folderIds);

  } finally {
    await database.close();
  }
}

function printDryRun(notes: ImportedNote[]) {
  console.log(`Found ${notes.length} Markdown files.\n`);

  const byFolder = groupBy(notes, getFolderLabel);

  for (const [folder, folderNotes] of byFolder) {
    console.log(`Folder: ${folder}`);

    for (const note of folderNotes) {
      const type = note.isMoc ? "[MOC]" : "[NOTE]";

      console.log(`  ${type} ${note.title} -> ${note.slug}`);
    }
  }
}

function validateImport(notes: ImportedNote[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const notesBySlug = groupBy(notes, (note) => note.slug);
  const notesByFolder = groupBy(notes, getFolderLabel);

  for (const note of notes) {
    if (!/^\d+\s*-\s*/.test(note.title)) {
      issues.push({
        level: "warning",
        message: `Note has no numeric prefix: ${note.sourcePath}`,
      });
    }

    if (note.folderPath === null) {
      issues.push({
        level: "warning",
        message: `Note exists at vault root: ${note.sourcePath}`,
      });
    }
  }

  for (const [slug, matchingNotes] of notesBySlug) {
    if (matchingNotes.length > 1) {
      issues.push({
        level: "error",
        message: `Duplicate slug "${slug}": ${matchingNotes
          .map((note) => note.sourcePath)
          .join(", ")}`,
      });
    }
  }

  for (const [folder, folderNotes] of notesByFolder) {
    const mocs = folderNotes.filter((note) => note.isMoc);

    if (folder === ROOT_FOLDER) {
      continue;
    }

    if (mocs.length === 0) {
      issues.push({
        level: "warning",
        message: `Folder has no MOC: ${folder}`,
      });
    }

    if (mocs.length > 1) {
      issues.push({
        level: "error",
        message: `Folder has multiple MOCs: ${folder}`,
      });
    }
  }

  return issues;
}

function printValidationReport(
  notes: ImportedNote[],
  issues: ValidationIssue[],
) {
  const errors = issues.filter((issue) => issue.level === "error");

  const warnings = issues.filter((issue) => issue.level === "warning");

  const folders = new Set(
    notes
      .map((note) => note.folderPath)
      .filter((folder): folder is string => folder !== null),
  );

  console.log("\nValidation");
  console.log(`✓ ${notes.length} notes discovered`);
  console.log(`✓ ${folders.size} folders discovered`);

  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (issues.length > 0) {
    console.log();

    for (const issue of issues) {
      const prefix = issue.level === "error" ? "ERROR" : "WARNING";

      console.log(`${prefix}: ${issue.message}`);
    }
  }

  console.log();

  if (errors.length > 0) {
    console.log("IMPORT BLOCKED");
  } else {
    console.log("IMPORT SAFE");
  }
}

function buildImportedFolders(notes: ImportedNote[]): ImportedFolder[] {
  const folderPaths = new Set<string>();

  for (const note of notes) {
    if (note.folderPath !== null) {
      folderPaths.add(note.folderPath);
    }
  }

  const folders: ImportedFolder[] = [];

  for (const folderPath of folderPaths) {
    // Our current DB model represents one folder level.
    // Do not silently flatten nested Obsidian folders.
    if (folderPath.split(path.sep).length > 1) {
      throw new Error(`Nested folder is not supported: ${folderPath}`);
    }

    const result = validateFolderName(folderPath);

    if (!result.success) {
      throw new Error(`Invalid folder "${folderPath}": ${result.error}`);
    }

    folders.push({
      sourcePath: folderPath,
      name: result.data.name,
      slug: result.data.slug,
    });
  }

  folders.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
    }),
  );

  return folders;
}

async function validateFoldersAgainstDatabase(
  database: Database,
  folders: ImportedFolder[],
): Promise<void> {
  for (const folder of folders) {
    const existingFolder = await database.orm.public.Folder.where({
      slug: folder.slug,
    }).first();

    if (!existingFolder) {
      continue;
    }

    if (existingFolder.name !== folder.name) {
      throw new Error(
        `Database conflict: slug "${folder.slug}" already belongs to "${existingFolder.name}", but importer wants "${folder.name}".`,
      );
    }
  }
}

async function validateNotesAgainstDatabase(
  notes: ImportedNote[],
): Promise<void> {
  for (const note of notes) {
    const existingNote = await db.orm.public.Note
      .where({ slug: note.slug })
      .first();

    if (!existingNote) {
      continue;
    }

    if (existingNote.title !== note.title) {
      throw new Error(
        `Database conflict: slug "${note.slug}" already belongs to "${existingNote.title}", but importer wants "${note.title}".`,
      );
    }
  }
}

async function importNotes(
  notes: ImportedNote[],
  folderIds: Map<string, number>,
): Promise<void> {
  let created = 0;
  let reused = 0;

  for (const note of notes) {
    if (note.folderPath === null) {
      throw new Error(
        `Cannot import note without folder: ${note.sourcePath}`,
      );
    }

    const folderId = folderIds.get(note.folderPath);

    if (folderId === undefined) {
      throw new Error(
        `Could not resolve folder "${note.folderPath}" for "${note.sourcePath}".`,
      );
    }

    const result = validateNote(
      note.title,
      note.content,
    );

    if (!result.success) {
      throw new Error(
        `Invalid note "${note.sourcePath}": ${result.error}`,
      );
    }

    const {
      title,
      slug,
      content,
    } = result.data;

    const existingNote = await db.orm.public.Note
      .where({ slug })
      .first();

    if (existingNote) {
      console.log(`Reusing note: ${title}`);
      reused++;
      continue;
    }

    console.log(`Creating note: ${title}`);

    await db.orm.public.Note.create({
      title,
      slug,
      content,
      folderId,
      publishedAt: new Date().toISOString(),
    });

    created++;
  }

  console.log();
  console.log(`Note import complete.`);
  console.log(`Created: ${created}`);
  console.log(`Reused: ${reused}`);
}

async function importFolders(
  database: Database,
  folders: ImportedFolder[],
): Promise<Map<string, number>> {
  const folderIds = new Map<string, number>();

  for (const folder of folders) {
    let databaseFolder = await database.orm.public.Folder.where({
      slug: folder.slug,
    }).first();

    if (!databaseFolder) {
      console.log(`Creating folder: ${folder.name}`);

      await database.orm.public.Folder.create({
        name: folder.name,
        slug: folder.slug,
      });

      databaseFolder = await database.orm.public.Folder.where({
        slug: folder.slug,
      }).first();

      if (!databaseFolder) {
        throw new Error(
          `Folder was created but could not be read back: ${folder.name}`,
        );
      }
    } else {
      console.log(`Reusing folder: ${folder.name}`);
    }

    folderIds.set(folder.sourcePath, databaseFolder.id);
  }

  return folderIds;
}

main().catch((error) => {
  console.error("Import discovery failed:", error);
  process.exit(1);
});
