import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function PageLayout({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "mx-auto min-h-screen w-full sm:max-w-[70vw] px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-8 lg:py-16",
        className,
      )}
      {...props}
    />
  );
}
