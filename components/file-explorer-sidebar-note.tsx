"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ExplorerNote } from "@/types/notes.types";
import { ItemActions } from "./file-explorer-sidebar-item-actions";
import { RenameNoteForm } from "./file-explorer-sidebar-forms";
import { cn } from "cn";

export function ExplorerNoteRow({
  note,
  isAdmin,
  isActive,
  renaming,
  renameValue,
  onRenameValueChange,
  onRenameBlur,
  onRenameKeyDown,
  onRenameSubmit,
  onRename,
  onDelete,
}: {
  note: ExplorerNote;
  isAdmin: boolean;
  isActive: boolean;
  renaming: boolean;
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  onRenameBlur: () => void;
  onRenameKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRenameSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <SidebarMenuSubItem>
      {renaming ? (
        <RenameNoteForm
          slug={note.slug}
          title={note.title}
          value={renameValue}
          onBlur={onRenameBlur}
          onChange={onRenameValueChange}
          onKeyDown={onRenameKeyDown}
          onSubmit={onRenameSubmit}
        />
      ) : (
        <>
          <SidebarMenuSubButton
            className="text-foreground/80"
            isActive={isActive}
            render={<Link href={`/notes/${note.slug}`} />}
          >
            <FileText className="ml-3 opacity-60 group-data-[collapsible=icon]:ml-0" />
            <span className={cn(isActive && "text-foreground font-semibold")}>
              {note.title}
            </span>
          </SidebarMenuSubButton>
          {isAdmin ? (
            <ItemActions
              name={note.title}
              rowType="menu-sub-item"
              onDelete={onDelete}
              onRename={onRename}
            />
          ) : null}
        </>
      )}
    </SidebarMenuSubItem>
  );
}
