import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { HTMLAttributes } from "react";

import rehypeHighlight from "rehype-highlight";
import { getNoteBySlug } from "@/lib/notes/queries";
import {
  getInternalNoteSlug,
  getInternalNoteSlugs,
  resolveInternalLinks,
} from "@/lib/notes/internal-links";
import { InternalNoteLink } from "@/components/markdown/internal-note-link";
import { Callout } from "@/components/markdown/callout";
import { MarkdownCode } from "@/components/markdown/markdown-code";
import { remarkCallouts } from "@/lib/notes/remark-callouts";

function MarkdownDiv({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const dataProps = props as HTMLAttributes<HTMLDivElement> &
    Record<`data-${string}`, string | undefined>;
  const calloutType = dataProps["data-callout-type"];

  if (!calloutType) {
    return <div {...props}>{children}</div>;
  }

  return (
    <Callout
      type={calloutType}
      title={dataProps["data-callout-title"]}
      fold={dataProps["data-callout-fold"] as "+" | "-" | undefined}
    >
      {children}
    </Callout>
  );
}

export async function MarkdownRenderer({ children }: { children: string }) {
  const resolvedMarkdown = resolveInternalLinks(children);
  const notes = await Promise.all(
    getInternalNoteSlugs(children).map(async (slug) => {
      const note = await getNoteBySlug(slug);
      return note
        ? ([slug, { title: note.title, content: note.content }] as const)
        : null;
    }),
  );
  const previews = new Map(
    notes.filter((note): note is NonNullable<typeof note> => note !== null),
  );

  return (
    <div className="max-w-full markdown-renderer prose dark:prose-invert">
      <Markdown
        components={{
          a: ({ href, node: _node, children: linkChildren, ...props }) => {
            void _node;
            const slug = getInternalNoteSlug(href);

            return slug ? (
              <InternalNoteLink href={href!} preview={previews.get(slug)}>
                {linkChildren}
              </InternalNoteLink>
            ) : (
              <a href={href} {...props}>
                {linkChildren}
              </a>
            );
          },
          code: MarkdownCode,
          div: MarkdownDiv,
        }}
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm, remarkCallouts]}
      >
        {resolvedMarkdown}
      </Markdown>
    </div>
  );
}
