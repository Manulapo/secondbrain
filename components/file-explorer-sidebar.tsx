"use client";

import {
  BrainCircuit,
  ChevronRight,
  FileText,
  FilePlus2,
  Folder,
  FolderPlus,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  createFolder,
  deleteFolder,
  updateFolder,
} from "@/app/admin/folders/actions";
import { createNote, deleteNote, updateNote } from "@/app/admin/notes/actions";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExplorerFolder } from "@/types/folder.types";
import { getActionErrorMessage } from "@/lib/action-error";
import { ExplorerNote } from "@/types/notes.types";
import { cn } from "cn";

function ItemActions({
  name,
  rowType = "menu-item",
  onRename,
  onDelete,
}: {
  name: string;
  rowType?: "menu-item" | "menu-sub-item";
  onRename?: () => void;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <SidebarMenuAction
                  aria-label={`More actions for ${name}`}
                  showOnHover={rowType}
                />
              }
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="right">More actions for {name}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" side="right">
        <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function expandableFolderIds(folders: ExplorerFolder[]): string[] {
  return folders.flatMap((folder) => [
    ...(folder.children.length || folder.notes.length ? [folder.id] : []),
    ...expandableFolderIds(folder.children),
  ]);
}

export function FileExplorerSidebar({
  folderTree,
  unfiledNotes,
  isAdmin,
}: {
  folderTree: ExplorerFolder[];
  unfiledNotes: ExplorerNote[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(
    () => new Set(expandableFolderIds([])), // expand all folders that have contents
  );
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingNote, setCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [renamingFolder, setRenamingFolder] = useState<{
    id: string;
    name: string;
    value: string;
    slug: string;
  } | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [renamingNote, setRenamingNote] = useState<{
    id: string;
    title: string;
    slug: string;
    value: string;
    content: string;
    folderId: string;
    published: boolean;
  } | null>(null);
  const [deletingNote, setDeletingNote] = useState<{
    title: string;
    slug: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pathname = usePathname();

  function toggleFolder(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleRenameFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const result = await updateFolder(formData);
      setRenamingFolder(null);
      router.replace(`/folders/${result.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      await createFolder(formData);
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

  async function handleDeleteFolder() {
    if (!deletingFolder) return;

    setDeleting(true);
    try {
      const formData = new FormData();
      formData.set("slug", deletingFolder.slug);
      await deleteFolder(formData);
      setDeletingFolder(null);
      toast.success("Folder deleted.");
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  async function handleRenameNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const result = await updateNote(formData);
      setRenamingNote(null);
      router.replace(`/notes/${result.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
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
      router.refresh();
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  function renderFolder(folder: ExplorerFolder) {
    //check param in url
    const isExpanded = expanded.has(folder.id);
    const shouldDim = expanded.size > 0 && !isExpanded;
    const hasContents = Boolean(folder.children.length || folder.notes.length);
    const isRenaming = renamingFolder?.id === folder.id;
    const noteSlug = pathname.split("/")[2];

    return (
      <SidebarMenuItem key={folder.id}>
        <button
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${folder.name}`}
          className="absolute left-1 z-10 flex size-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30"
          disabled={!hasContents}
          onClick={() => toggleFolder(folder.id)}
          type="button"
        >
          <ChevronRight
            className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </button>
        {isRenaming ? (
          <form
            className="flex w-full items-center gap-2 pl-8"
            onSubmit={handleRenameFolder}
          >
            <input name="slug" type="hidden" value={folder.slug} />
            <Folder className="size-4 shrink-0" />
            <Input
              autoFocus
              aria-label={`Rename ${folder.name}`}
              className="h-8 w-full flex-1"
              maxLength={80}
              name="name"
              onBlur={() => {
                if (!renamingFolder.value.trim()) setRenamingFolder(null);
              }}
              onChange={(event) =>
                setRenamingFolder((current) =>
                  current ? { ...current, value: event.target.value } : current,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setRenamingFolder(null);
                }
              }}
              value={renamingFolder.value}
            />
          </form>
        ) : (
          <>
            <SidebarMenuButton
              className={`pl-8 ${shouldDim ? "opacity-50" : ""}`}
              isActive={isExpanded}
              render={<Link href={`/folders/${folder.slug}`} />}
            >
              <Folder />
              <span className={isExpanded ? "font-bold" : ""}>
                {folder.name}
              </span>
            </SidebarMenuButton>
            <ItemActions
              name={folder.name}
              onDelete={() =>
                setDeletingFolder({ name: folder.name, slug: folder.slug })
              }
              onRename={() =>
                setRenamingFolder({
                  id: folder.id,
                  name: folder.name,
                  slug: folder.slug,
                  value: folder.name,
                })
              }
            />
          </>
        )}
        {isExpanded && hasContents && (
          <SidebarMenuSub>
            {folder.children.map((child) => renderFolder(child))}
            {folder.notes.map((note) => (
              <SidebarMenuSubItem key={note.id}>
                {renamingNote?.id === note.id ? (
                  <form
                    className="flex min-w-0 items-center gap-2"
                    onSubmit={handleRenameNote}
                  >
                    <input name="slug" type="hidden" value={note.slug} />
                    <input name="content" type="hidden" value={note.content} />
                    <input
                      name="folderId"
                      type="hidden"
                      value={note.folderId}
                    />
                    <input
                      name="published"
                      type="hidden"
                      value={note.published ? "true" : "false"}
                    />
                    <FileText className="ml-3 size-4 shrink-0" />
                    <Input
                      autoFocus
                      aria-label={`Rename ${note.title}`}
                      className="h-7 min-w-0 flex-1"
                      maxLength={120}
                      name="title"
                      onBlur={() => {
                        if (!renamingNote.value.trim()) setRenamingNote(null);
                      }}
                      onChange={(event) =>
                        setRenamingNote((current) =>
                          current
                            ? { ...current, value: event.target.value }
                            : current,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setRenamingNote(null);
                        }
                      }}
                      value={renamingNote.value}
                    />
                  </form>
                ) : (
                  <>
                    <SidebarMenuSubButton
                      className="text-foreground/80"
                      render={<Link href={`/notes/${note.slug}`} />}
                    >
                      <FileText className="ml-3 opacity-60" />
                      <span
                        className={cn({
                          "text-foreground font-semibold":
                            noteSlug === note.slug,
                        })}
                      >
                        {note.title}
                      </span>
                    </SidebarMenuSubButton>
                    <ItemActions
                      name={note.title}
                      rowType="menu-sub-item"
                      onDelete={() =>
                        setDeletingNote({
                          title: note.title,
                          slug: note.slug,
                        })
                      }
                      onRename={() =>
                        setRenamingNote({
                          id: note.id,
                          title: note.title,
                          slug: note.slug,
                          value: note.title,
                          content: note.content,
                          folderId: note.folderId,
                          published: note.published,
                        })
                      }
                    />
                  </>
                )}
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  function renderNote(note: ExplorerNote) {
    return (
      <SidebarMenuSubItem key={note.id}>
        <SidebarMenuSubButton render={<Link href={`/notes/${note.slug}`} />}>
          <FileText className="ml-3" />
          <span>{note.title}</span>
        </SidebarMenuSubButton>
        <ItemActions
          name={note.title}
          rowType="menu-sub-item"
          onDelete={() =>
            setDeletingNote({ title: note.title, slug: note.slug })
          }
          onRename={() =>
            setRenamingNote({
              id: note.id,
              title: note.title,
              slug: note.slug,
              value: note.title,
              content: note.content,
              folderId: note.folderId,
              published: note.published,
            })
          }
        />
      </SidebarMenuSubItem>
    );
  }

  return (
    <>
      <Sidebar collapsible="icon" className="min-h-screen border-r">
        <SidebarHeader className="h-16 justify-center border-b px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <BrainCircuit className="h-6 w-6" />
            </div>
            {isAdmin && (
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label="Create folder"
                        onClick={() => {
                          setNewFolderName("");
                          setCreatingFolder(true);
                        }}
                        size="icon-sm"
                        title="Create folder"
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
                        onClick={() => {
                          setNewNoteTitle("");
                          setCreatingNote(true);
                        }}
                        size="icon-sm"
                        title="Create file"
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
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {creatingNote && isAdmin && (
                  <SidebarMenuItem>
                    <form
                      className="flex items-center gap-2"
                      onSubmit={handleCreateNote}
                    >
                      <FileText className="ml-3 size-4 shrink-0" />
                      <Input
                        autoFocus
                        aria-label="New note title"
                        className="h-8 min-w-0 flex-1"
                        maxLength={120}
                        name="title"
                        onBlur={() => {
                          if (!newNoteTitle.trim()) setCreatingNote(false);
                        }}
                        onChange={(event) =>
                          setNewNoteTitle(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setCreatingNote(false);
                          }
                        }}
                        placeholder="New note"
                        required
                        value={newNoteTitle}
                      />
                      <input name="published" type="hidden" value="true" />
                    </form>
                  </SidebarMenuItem>
                )}
                {creatingFolder && isAdmin && (
                  <SidebarMenuItem>
                    <form
                      className="flex items-center gap-2"
                      onSubmit={handleCreateFolder}
                    >
                      <Folder className="size-4" />
                      <Input
                        autoFocus
                        aria-label="New folder name"
                        className="h-8 min-w-0 flex-1"
                        maxLength={80}
                        name="name"
                        onBlur={() => {
                          if (!newFolderName.trim()) setCreatingFolder(false);
                        }}
                        onChange={(event) =>
                          setNewFolderName(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            setCreatingFolder(false);
                          }
                        }}
                        placeholder="New folder"
                        value={newFolderName}
                      />
                    </form>
                  </SidebarMenuItem>
                )}
                {folderTree.map((folder) => renderFolder(folder))}
                {unfiledNotes.map((note) => renderNote(note))}
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
