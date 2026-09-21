"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import type { CopyCodeButtonProps } from "@/types/markdown.types";

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      aria-label={copied ? "Copied code" : "Copy code"}
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
