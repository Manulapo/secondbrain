"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateNote } from "@/app/admin/notes/actions";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { FormToolbar } from "@/components/ui/form-toolbar";
import { Input } from "@/components/ui/input";
import { getActionErrorMessage } from "@/lib/action-error";

type NoteEditFormProps = {
  content: string;
  folderId: number | null;
  originalSlug: string;
  published: boolean;
  title: string;
};

export function NoteEditForm({
  content: initialContent,
  folderId,
  originalSlug,
  published,
  title: initialTitle,
}: NoteEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [savedTitle, setSavedTitle] = useState(initialTitle);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [isPending, setIsPending] = useState(false);
  const isDirty = title !== savedTitle || content !== savedContent;
  const formId = "edit-note-form";

  function handleCancel() {
    setTitle(savedTitle);
    setContent(savedContent);

    router.replace(`/notes/${originalSlug}`);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isDirty || isPending) return;

    setIsPending(true);
    try {
      const result = await updateNote(new FormData(event.currentTarget));
      const normalizedTitle = title.trim();
      setTitle(normalizedTitle);
      setSavedTitle(normalizedTitle);
      setSavedContent(content);
      toast.success("Note updated.");

      if (result.slug !== originalSlug) {
        router.replace(`/admin/notes/${result.slug}`);
      } else {
        router.replace(`/notes/${result.slug}`);
      }
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="relative">
      <form className="space-y-4" id={formId} onSubmit={handleSubmit}>
        <input name="slug" type="hidden" value={originalSlug} />
        <input name="folderId" type="hidden" value={folderId ?? ""} />
        <input
          name="published"
          type="hidden"
          value={published ? "true" : "false"}
        />
        <label className="block">
          <span className="text-muted-foreground text-xs">Title</span>
        </label>
        <Input
          aria-label="Note title"
          maxLength={120}
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          required
          value={title}
        />
        <label className="block">
          <span className="text-muted-foreground text-xs">Content</span>
        </label>
        <input name="content" type="hidden" value={content} />
        <MarkdownEditor
          markdown={content}
          onChange={setContent}
          toolbarActions={
            <FormToolbar
              formId={formId}
              isDirty={isDirty}
              isPending={isPending}
              onCancel={handleCancel}
            />
          }
        />
      </form>
    </div>
  );
}
