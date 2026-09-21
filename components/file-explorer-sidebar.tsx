"use client";

import { FilePlus2, FolderPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  createFolder,
  deleteFolder,
  updateFolder,
} from "@/app/admin/folders/actions";
import { createNote, deleteNote, renameNote } from "@/app/admin/notes/actions";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getActionErrorMessage } from "@/lib/action-error";
import { appConfig } from "@/lib/app-config";
import { getRouteSlug } from "@/lib/route-slug";
import { ExplorerFolder } from "@/types/folder.types";
import { ExplorerNote } from "@/types/notes.types";
import {
  CreateFolderForm,
  CreateNoteForm,
} from "./file-explorer-sidebar-forms";
import { ExplorerFolderRow } from "./file-explorer-sidebar-folder";
import { ExplorerNoteRow } from "./file-explorer-sidebar-note";
import Link from "next/link";

export function FileExplorerSidebar({
  folderTree,
  unfiledNotes,
  isAdmin,
  className,
}: {
  folderTree: ExplorerFolder[];
  unfiledNotes: ExplorerNote[];
  isAdmin: boolean;
  className?: string;
}) {
  const AppIcon = appConfig.icon;
  const router = useRouter();
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const folderSlug = getRouteSlug(pathname, "folders");
  const noteSlug = getRouteSlug(pathname, "notes");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingNote, setCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [renamingFolder, setRenamingFolder] = useState<{
    id: string;
    name: string;
    slug: string;
    value: string;
  } | null>(null);
  const [renamingNote, setRenamingNote] = useState<{
    id: string;
    title: string;
    slug: string;
    value: string;
  } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [deletingNote, setDeletingNote] = useState<{
    title: string;
    slug: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  function toggleFolder(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startCreating(type: "folder" | "note") {
    setOpen(true);

    if (type === "folder") {
      setNewFolderName("");
      setCreatingFolder(true);
      return;
    }

    setNewNoteTitle("");
    setCreatingNote(true);
  }

  async function handleRenameFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await updateFolder(new FormData(event.currentTarget));
      setRenamingFolder(null);
      router.replace(`/folders/${result.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createFolder(new FormData(event.currentTarget));
      setCreatingFolder(false);
      setNewFolderName("");
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await createNote(new FormData(event.currentTarget));
      setCreatingNote(false);
      setNewNoteTitle("");
      router.push(`/notes/${result.slug}`);
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleRenameNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await renameNote(new FormData(event.currentTarget));
      setRenamingNote(null);
      router.replace(`/notes/${result.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleDeleteFolder() {
    if (!deletingFolder) return;
    setDeleting(true);
    try {
      const formData = new FormData();
      formData.set("slug", deletingFolder.slug);
      await deleteFolder(formData);
      setDeletingFolder(null);
      toast.success("Folder deleted.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteNote() {
    if (!deletingNote) return;
    setDeleting(true);
    try {
      const formData = new FormData();
      formData.set("slug", deletingNote.slug);
      await deleteNote(formData);
      setDeletingNote(null);
      toast.success("Note deleted.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  function renderNote(note: ExplorerNote) {
    return (
      <ExplorerNoteRow
        key={note.id}
        isActive={noteSlug === note.slug}
        isAdmin={isAdmin}
        note={note}
        renaming={renamingNote?.id === note.id}
        renameValue={renamingNote?.value ?? note.title}
        onDelete={() => setDeletingNote({ title: note.title, slug: note.slug })}
        onRename={() =>
          setRenamingNote({
            id: note.id,
            title: note.title,
            slug: note.slug,
            value: note.title,
          })
        }
        onRenameBlur={() => {
          if (!renamingNote?.value.trim()) setRenamingNote(null);
        }}
        onRenameKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setRenamingNote(null);
          }
        }}
        onRenameSubmit={handleRenameNote}
        onRenameValueChange={(value) =>
          setRenamingNote((current) =>
            current ? { ...current, value } : current,
          )
        }
      />
    );
  }

  function renderFolder(folder: ExplorerFolder): React.ReactNode {
    return (
      <ExplorerFolderRow
        key={folder.id}
        folder={folder}
        isAdmin={isAdmin}
        isExpanded={expanded.has(folder.id)}
        hasExpandedFolder={expanded.size > 0}
        isSelected={
          folderSlug === folder.slug || noteSlug === `moc-${folder.slug}`
        }
        noteSlug={noteSlug}
        renamingFolder={renamingFolder}
        renamingNote={renamingNote}
        onDeleteFolder={() =>
          setDeletingFolder({ name: folder.name, slug: folder.slug })
        }
        onDeleteNote={(note) =>
          setDeletingNote({ title: note.title, slug: note.slug })
        }
        onRenameFolder={() =>
          setRenamingFolder({
            id: folder.id,
            name: folder.name,
            slug: folder.slug,
            value: folder.name,
          })
        }
        onRenameFolderBlur={() => {
          if (!renamingFolder?.value.trim()) setRenamingFolder(null);
        }}
        onRenameFolderKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setRenamingFolder(null);
          }
        }}
        onRenameFolderSubmit={handleRenameFolder}
        onRenameFolderValueChange={(value) =>
          setRenamingFolder((current) =>
            current ? { ...current, value } : current,
          )
        }
        onRenameNote={(note) =>
          setRenamingNote({
            id: note.id,
            title: note.title,
            slug: note.slug,
            value: note.title,
          })
        }
        onRenameNoteBlur={() => {
          if (!renamingNote?.value.trim()) setRenamingNote(null);
        }}
        onRenameNoteKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setRenamingNote(null);
          }
        }}
        onRenameNoteSubmit={handleRenameNote}
        onRenameNoteValueChange={(value) =>
          setRenamingNote((current) =>
            current ? { ...current, value } : current,
          )
        }
        onToggle={() => toggleFolder(folder.id)}
        renderFolder={renderFolder}
      />
    );
  }

  return (
    <>
      <Sidebar collapsible="icon" className={className}>
        <SidebarHeader className="h-16 justify-center border-b px-4 group-data-[collapsible=icon]:px-0">
          <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:justify-center">
            <Link href="/">
              <AppIcon aria-label={appConfig.name} className="h-6 w-6" />
            </Link>
            {isAdmin ? (
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label="Create folder"
                        onClick={() => startCreating("folder")}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      />
                    }
                  >
                    <FolderPlus />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">New folder</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label="Create file"
                        onClick={() => startCreating("note")}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      />
                    }
                  >
                    <FilePlus2 />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">New file</TooltipContent>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {creatingNote && isAdmin ? (
                  <SidebarMenuItem>
                    <CreateNoteForm
                      value={newNoteTitle}
                      onBlur={() => {
                        if (!newNoteTitle.trim()) setCreatingNote(false);
                      }}
                      onChange={setNewNoteTitle}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setCreatingNote(false);
                        }
                      }}
                      onSubmit={handleCreateNote}
                    />
                  </SidebarMenuItem>
                ) : null}
                {creatingFolder && isAdmin ? (
                  <SidebarMenuItem>
                    <CreateFolderForm
                      value={newFolderName}
                      onBlur={() => {
                        if (!newFolderName.trim()) setCreatingFolder(false);
                      }}
                      onChange={setNewFolderName}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setCreatingFolder(false);
                        }
                      }}
                      onSubmit={handleCreateFolder}
                    />
                  </SidebarMenuItem>
                ) : null}
                {folderTree.map(renderFolder)}
                {unfiledNotes.map(renderNote)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-3">
          <div className="flex items-center justify-end gap-1">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
        </SidebarFooter>
      </Sidebar>
      <DeleteConfirmationDialog
        deleting={deleting}
        itemName={deletingFolder?.name ?? ""}
        itemType="folder"
        onConfirm={handleDeleteFolder}
        open={deletingFolder !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeletingFolder(null);
        }}
      />
      <DeleteConfirmationDialog
        deleting={deleting}
        itemName={deletingNote?.title ?? ""}
        itemType="note"
        onConfirm={handleDeleteNote}
        open={deletingNote !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeletingNote(null);
        }}
      />
    </>
  );
}
