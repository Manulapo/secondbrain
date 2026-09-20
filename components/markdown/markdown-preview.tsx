"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { resolveInternalLinks } from "@/lib/notes/internal-links";
import { MarkdownCode } from "@/components/markdown/markdown-code";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="markdown-renderer prose max-w-none dark:prose-invert">
      <Markdown
        components={{ code: MarkdownCode }}
        rehypePlugins={[rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
      >
        {resolveInternalLinks(content)}
      </Markdown>
    </div>
  );
}
