"use client";

import { MoreHorizontal } from "lucide-react";

import { SidebarMenuAction } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ItemActions({
  name,
  rowType = "menu-item",
  onRename,
  onDelete,
}: {
  name: string;
  rowType?: "menu-item" | "menu-sub-item";
  onRename: () => void;
  onDelete: () => void;
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
