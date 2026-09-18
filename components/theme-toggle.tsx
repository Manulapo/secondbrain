"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="Change theme"
                  size="icon"
                  type="button"
                  variant="ghost"
                />
              }
            />
          }
        >
          {mounted && theme === "dark" ? (
            <Moon />
          ) : mounted && theme === "light" ? (
            <Sun />
          ) : (
            <Monitor />
          )}
        </TooltipTrigger>
        <TooltipContent side="left">Theme: {mounted ? theme : "system"}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuRadioGroup
          onValueChange={setTheme}
          value={mounted ? theme : "system"}
        >
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
