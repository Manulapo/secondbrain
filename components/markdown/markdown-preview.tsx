"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { resolveInternalLinks } from "@/lib/notes/internal-links";
import { MarkdownCallout } from "@/components/markdown/callout";
import { MarkdownCode } from "@/components/markdown/markdown-code";
import { remarkCallouts } from "@/lib/notes/remark-callouts";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="markdown-renderer prose max-w-none dark:prose-invert">
      <Markdown
        components={{ code: MarkdownCode, div: MarkdownCallout }}
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm, remarkCallouts]}
      >
        {resolveInternalLinks(content)}
      </Markdown>
    </div>
  );
}
