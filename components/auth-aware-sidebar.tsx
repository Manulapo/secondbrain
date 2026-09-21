"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";

function isAuthPage(pathname: string | null) {
  return pathname === "/login" || pathname === "/signup";
}

export function AuthAwareSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAuthPage(pathname)) return null;

  return children;
}

export function AuthAwareSidebarTrigger() {
  const pathname = usePathname();

  if (isAuthPage(pathname)) return null;

  return <SidebarTrigger className="md:hidden" />;
}
