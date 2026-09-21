"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="h-8 w-8 opacity-50 hover:opacity-100"
            aria-label="Log out"
            onClick={handleLogout}
            size="icon"
            type="button"
            variant="ghost"
          />
        }
      >
        <LogOut />
      </TooltipTrigger>
      <TooltipContent>Log out</TooltipContent>
    </Tooltip>
  );
}
