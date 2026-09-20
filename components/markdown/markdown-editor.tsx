"use client";

import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import {
  HighlightStyle,
  LanguageDescription,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useEffect, useRef, type ReactNode } from "react";
import { EditorView } from "@codemirror/view";
import { CopyMarkdownButton } from "@/components/markdown/copy-markdown-button";

type MarkdownEditorProps = {
  markdown: string;
  onChange: (markdown: string) => void;
  toolbarActions?: ReactNode;
};

const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, color: "var(--primary)", fontWeight: "700" },
  { tag: tags.emphasis, color: "var(--foreground)", fontStyle: "italic" },
  { tag: tags.strong, color: "var(--foreground)", fontWeight: "700" },
  {
    tag: [tags.link, tags.url],
    color: "var(--primary)",
    textDecoration: "underline",
  },
  {
    tag: tags.monospace,
    backgroundColor: "var(--muted)",
    color: "var(--foreground)",
  },
  { tag: tags.comment, color: "var(--muted-foreground)" },
  { tag: tags.keyword, color: "var(--primary)" },
  { tag: tags.definition(tags.variableName), color: "var(--foreground)" },
  { tag: tags.variableName, color: "var(--foreground)" },
  { tag: tags.propertyName, color: "var(--primary)" },
  { tag: tags.typeName, color: "var(--primary)" },
  { tag: tags.string, color: "var(--chart-2)" },
  { tag: tags.number, color: "var(--chart-3)" },
  { tag: tags.bool, color: "var(--chart-4)" },
  { tag: tags.operator, color: "var(--muted-foreground)" },
]);

const markdownCodeLanguages = [
  LanguageDescription.of({
    alias: ["javascript", "js", "jsx"],
    name: "JavaScript",
    support: javascript({ jsx: true }),
  }),
  LanguageDescription.of({
    alias: ["typescript", "ts", "tsx"],
    name: "TypeScript",
    support: javascript({ typescript: true, jsx: true }),
  }),
];

const markdownEditorTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    minHeight: "500px",
  },
  ".cm-content": {
    caretColor: "var(--foreground)",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    lineHeight: "1.5",
    minHeight: "500px",
    padding: "0.75rem",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--foreground)",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-scroller": {
    minHeight: "500px",
    overflow: "auto",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "var(--accent)",
  },
});

const markdownEditorExtensions = [
  basicSetup,
  markdown({
    base: markdownLanguage,
    codeLanguages: markdownCodeLanguages,
  }),
  markdownEditorTheme,
  syntaxHighlighting(markdownHighlightStyle),
  EditorView.lineWrapping,
  EditorView.contentAttributes.of({ "aria-label": "Markdown source" }),
];

export function MarkdownEditor({
  markdown: value,
  onChange,
  toolbarActions,
}: MarkdownEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editorView = new EditorView({
      parent: editorContainerRef.current,
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          ...markdownEditorExtensions,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
    });

    editorViewRef.current = editorView;

    return () => {
      editorView.destroy();
      editorViewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const editorView = editorViewRef.current;
    if (!editorView || editorView.state.doc.toString() === value) return;

    editorView.dispatch({
      changes: {
        from: 0,
        insert: value,
        to: editorView.state.doc.length,
      },
    });
  }, [value]);

  return (
    <div className="pb-24">
      <div className="mb-2 flex justify-end border-b border-border/60 pb-2">
        <CopyMarkdownButton markdown={value} />
      </div>
      <div className="outline-none">
        <div className="min-h-[500px]" ref={editorContainerRef} />
      </div>
      {toolbarActions ? (
        <div className="fixed bottom-4 left-1/2 z-20 w-[60%] -translate-x-1/2 rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex justify-end p-3">{toolbarActions}</div>
        </div>
      ) : null}
    </div>
  );
}
