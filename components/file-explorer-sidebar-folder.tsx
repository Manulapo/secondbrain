"use client";

import { ChevronRight, Folder } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { ExplorerFolder } from "@/types/folder.types";
import { ItemActions } from "./file-explorer-sidebar-item-actions";
import { RenameFolderForm } from "./file-explorer-sidebar-forms";
import { ExplorerNoteRow } from "./file-explorer-sidebar-note";

export function ExplorerFolderRow({
  folder,
  isAdmin,
  isExpanded,
  hasExpandedFolder,
  isSelected,
  noteSlug,
  renamingFolder,
  renamingNote,
  onToggle,
  onRenameFolderValueChange,
  onRenameFolderBlur,
  onRenameFolderKeyDown,
  onRenameFolderSubmit,
  onRenameFolder,
  onDeleteFolder,
  onRenameNoteValueChange,
  onRenameNoteBlur,
  onRenameNoteKeyDown,
  onRenameNoteSubmit,
  onRenameNote,
  onDeleteNote,
  renderFolder,
}: {
  folder: ExplorerFolder;
  isAdmin: boolean;
  isExpanded: boolean;
  hasExpandedFolder: boolean;
  isSelected: boolean;
  noteSlug: string | null;
  renamingFolder: { id: string; value: string } | null;
  renamingNote: { id: string; value: string } | null;
  onToggle: () => void;
  onRenameFolderValueChange: (value: string) => void;
  onRenameFolderBlur: () => void;
  onRenameFolderKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRenameFolderSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRenameFolder: () => void;
  onDeleteFolder: () => void;
  onRenameNoteValueChange: (value: string) => void;
  onRenameNoteBlur: () => void;
  onRenameNoteKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRenameNoteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRenameNote: (note: ExplorerFolder["notes"][number]) => void;
  onDeleteNote: (note: ExplorerFolder["notes"][number]) => void;
  renderFolder: (folder: ExplorerFolder) => React.ReactNode;
}) {
  const hasContents = Boolean(folder.children.length || folder.notes.length);

  return (
    <SidebarMenuItem
      className={
        hasExpandedFolder && !isExpanded
          ? "opacity-50 transition-opacity"
          : "transition-opacity"
      }
    >
      <button
        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${folder.name}`}
        className="absolute left-1 z-10 flex size-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30 group-data-[collapsible=icon]:hidden"
        disabled={!hasContents}
        onClick={onToggle}
        type="button"
      >
        <ChevronRight
          className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>
      {renamingFolder?.id === folder.id ? (
        <RenameFolderForm
          name={folder.name}
          slug={folder.slug}
          value={renamingFolder.value}
          onBlur={onRenameFolderBlur}
          onChange={onRenameFolderValueChange}
          onKeyDown={onRenameFolderKeyDown}
          onSubmit={onRenameFolderSubmit}
        />
      ) : (
        <>
          <SidebarMenuButton
            className="pl-8 group-data-[collapsible=icon]:pl-2!"
            isActive={isSelected}
            render={<Link href={`/folders/${folder.slug}`} />}
            onClick={() => {
              if (hasContents) onToggle();
            }}
          >
            <Folder />
            <span className={isSelected ? "font-bold" : ""}>{folder.name}</span>
          </SidebarMenuButton>
          {isAdmin ? (
            <ItemActions
              name={folder.name}
              onDelete={onDeleteFolder}
              onRename={onRenameFolder}
            />
          ) : null}
        </>
      )}
      {isExpanded && hasContents ? (
        <SidebarMenuSub>
          {folder.children.map(renderFolder)}
          {folder.notes.map((note) => (
            <ExplorerNoteRow
              key={note.id}
              isActive={noteSlug === note.slug}
              isAdmin={isAdmin}
              note={note}
              renaming={renamingNote?.id === note.id}
              renameValue={renamingNote?.value ?? note.title}
              onDelete={() => onDeleteNote(note)}
              onRename={() => onRenameNote(note)}
              onRenameBlur={onRenameNoteBlur}
              onRenameKeyDown={onRenameNoteKeyDown}
              onRenameSubmit={onRenameNoteSubmit}
              onRenameValueChange={onRenameNoteValueChange}
            />
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}
