"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Folder,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { ExplorerFolder } from "@/types/folder.types";

function ItemActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <SidebarMenuAction
                  aria-label={`More actions for ${name}`}
                  showOnHover
                />
              }
            />
          }
        >
          <MoreHorizontal />
        </TooltipTrigger>
        <TooltipContent side="right">More actions for {name}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" side="right">
        <DropdownMenuItem>Update</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function expandableFolderIds(folders: ExplorerFolder[]): string[] {
  return folders.flatMap((folder) => [
    ...(folder.children.length || folder.notes.length
      ? [folder.id]
      : []),
    ...expandableFolderIds(folder.children),
  ]);
}

export function FileExplorerSidebar({
  folderTree,
}: {
  folderTree: ExplorerFolder[];
}) {
  const [expanded, setExpanded] = useState(
    () => new Set(expandableFolderIds(folderTree)), // expand all folders that have contents
  );

  function toggleFolder(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderFolder(folder: ExplorerFolder) {
    const isExpanded = expanded.has(folder.id);
    const hasContents = Boolean(folder.children.length || folder.notes.length);

    return (
      <SidebarMenuItem key={folder.id}>
        <button
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${folder.name}`}
          className="absolute left-1 top-1.5 z-10 flex size-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30"
          disabled={!hasContents}
          onClick={() => toggleFolder(folder.id)}
          type="button"
        >
          <ChevronRight className={`size-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
        <SidebarMenuButton className="pl-8" render={<Link href={`/folders/${folder.slug}`} />}>
          <Folder />
          <span>{folder.name}</span>
        </SidebarMenuButton>
        <ItemActions name={folder.name} />
        {isExpanded && hasContents && (
          <SidebarMenuSub>
            {folder.children.map((child) => renderFolder(child))}
            {folder.notes.map((note) => (
              <SidebarMenuSubItem key={note.id}>
                <SidebarMenuSubButton render={<Link href={`/notes/${note.slug}`} />}>
                  <FileText />
                  <span>{note.title}</span>
                </SidebarMenuSubButton>
                <ItemActions name={note.title} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar collapsible="icon" className="min-h-screen border-r">
      <SidebarHeader className="h-16 justify-center border-b px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Second Brain</p>
            <p className="truncate text-xs text-muted-foreground">Your knowledge base</p>
          </div>
          <Button aria-label="Add note" size="sm" title="Add note" type="button" className="cursor-pointer">
            <Plus />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Explorer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{folderTree.map((folder) => renderFolder(folder))}</SidebarMenu>
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
  );
}
