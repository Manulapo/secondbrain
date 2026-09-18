import { db } from "@/lib/db";
import { FileExplorerSidebar } from "./file-explorer-sidebar";
import { ExplorerFolder } from "@/types/folder.types";

export async function FileExplorerSidebarServer() {
  const folders = await db.orm.public.Folder
    .where((folder) => folder.publishedAt.isNotNull())
    .where((folder) =>
      folder.notes.some((note) => note.publishedAt.isNotNull()),
    )
    .include("notes", (notes) =>
      notes
        .where((note) => note.publishedAt.isNotNull())
        .orderBy((note) => note.title.asc()),
    )
    .orderBy((folder) => folder.name.asc())
    .all();

  const nodes = new Map<number, ExplorerFolder>();

  for (const folder of folders) {
    nodes.set(folder.id, {
      id: String(folder.id),
      name: folder.name,
      slug: folder.slug,
      children: [],
      notes: folder.notes.map((note) => ({
        id: String(note.id),
        title: note.title,
        slug: note.slug,
      })),
    });
  }

  const roots: ExplorerFolder[] = [];

  for (const folder of folders) {
    const node = nodes.get(folder.id);
    const parent = folder.parentFolderId !== null
    ? nodes.get(folder.parentFolderId)
    : undefined;

    if (node && parent) parent.children.push(node);
    else if (node) roots.push(node);
  }

  return <FileExplorerSidebar folderTree={roots} />;
}
