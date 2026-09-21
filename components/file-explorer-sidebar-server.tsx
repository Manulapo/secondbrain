import {
  getAdminExplorerFolders,
  getExplorerFolders,
} from "@/lib/folders/queries";
import { getAdminExplorerNotes, getExplorerNotes } from "@/lib/notes/queries";
import { isMOCNote } from "@/lib/utils";
import { ExplorerFolder } from "@/types/folder.types";
import { ExplorerNote } from "@/types/notes.types";
import { FileExplorerSidebar } from "./file-explorer-sidebar";
import { getCurrentUser } from "@/lib/auth/auth-utils";

export async function FileExplorerSidebarServer() {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const folders = isAdmin
    ? await getAdminExplorerFolders()
    : await getExplorerFolders();
  const notes = isAdmin
    ? await getAdminExplorerNotes()
    : await getExplorerNotes();
  const nodes = new Map<number, ExplorerFolder>();

  for (const folder of folders) {
    nodes.set(folder.id, {
      id: String(folder.id),
      name: folder.name,
      slug: folder.slug,
      children: [],
      notes: folder.notes
        .filter((note) => !isMOCNote(note.title))
        .map((note) => ({
          id: String(note.id),
          title: note.title,
          slug: note.slug,
          folderId: String(folder.id),
        }))
        .sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { numeric: true }),
        ),
    });
  }

  const roots: ExplorerFolder[] = [];
  const unfiledNotes: ExplorerNote[] = notes
    .filter((note) => note.folderId === null)
    .map((note) => ({
      id: String(note.id),
      title: note.title,
      slug: note.slug,
      folderId: "",
    }));

  for (const folder of folders) {
    const node = nodes.get(folder.id);
    const parent =
      folder.parentFolderId !== null
        ? nodes.get(folder.parentFolderId)
        : undefined;

    if (node && parent) parent.children.push(node);
    else if (node) roots.push(node);
  }

  return (
    <FileExplorerSidebar
      isAdmin={isAdmin}
      folderTree={roots}
      unfiledNotes={unfiledNotes}
      className="rounded-2xl overflow-hidden h-[98vh] mt-[1vh] ml-[0.5vw] shadow-lg dark:shadow-black/20  backdrop-blur supports-[backdrop-filter]:bg-card/40"
    />
  );
}
