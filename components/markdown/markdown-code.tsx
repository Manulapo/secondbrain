import { isValidElement, type HTMLAttributes, type ReactNode } from "react";

import { CopyCodeButton } from "@/components/markdown/copy-code-button";
import { MermaidDiagram } from "@/components/markdown/mermaid-diagram";

function getTextContent(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return getTextContent(value.props.children);
  }

  return "";
}

export function MarkdownCode({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const code = getTextContent(children).replace(/\n$/, "");
  const language = className?.match(/language-(\S+)/)?.[1];

  if (language?.toLowerCase() === "mermaid") {
    return (
      <div className="not-prose relative my-4 overflow-hidden rounded-xl border border-border bg-muted/20">
        <MermaidDiagram code={code} />
      </div>
    );
  }

  if (!className) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="not-prose relative my-4 overflow-hidden rounded-xl border border-border bg-muted/50">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-muted-foreground font-mono text-xs">
          {language ?? "code"}
        </span>
        <CopyCodeButton code={code} />
      </div>
      <pre className="m-0 overflow-x-auto p-4" {...props}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
