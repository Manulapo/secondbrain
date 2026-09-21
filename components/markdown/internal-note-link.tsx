"use client";

import { PreviewCard } from "@base-ui/react/preview-card";
import Link from "next/link";
import type { ReactNode } from "react";

import { MarkdownPreview } from "@/components/markdown/markdown-preview";
import type { NotePreview } from "@/types/markdown.types";

export function InternalNoteLink({
  href,
  children,
  preview,
}: {
  href: string;
  children: ReactNode;
  preview?: NotePreview;
}) {
  if (!preview) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        render={<Link href={href} />}
        className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {children}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner
          sideOffset={10}
          className="z-50 max-w-[min(28rem,calc(100vw-2rem))]"
        >
          <PreviewCard.Popup className="max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl outline-none transition duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <h3 className="mb-3 font-semibold">{preview.title}</h3>
            <MarkdownPreview content={preview.content} />
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
