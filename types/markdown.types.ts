import type { ReactNode } from "react";

export type NotePreview = {
  title: string;
  content: string;
};

export type CopyCodeButtonProps = {
  code: string;
};

export type MarkdownEditorProps = {
  markdown: string;
  onChange: (markdown: string) => void;
  toolbarActions?: ReactNode;
};
