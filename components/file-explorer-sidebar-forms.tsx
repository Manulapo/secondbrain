"use client";

import { FileText, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CreateNoteForm({
  value,
  onChange,
  onBlur,
  onKeyDown,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex items-center gap-2" onSubmit={onSubmit}>
      <FileText className="ml-3 size-4 shrink-0" />
      <Input
        autoFocus
        aria-label="New note title"
        className="h-8 min-w-0 flex-1"
        maxLength={120}
        name="title"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="New note"
        required
        value={value}
      />
      <input name="published" type="hidden" value="true" />
    </form>
  );
}

export function CreateFolderForm({
  value,
  onChange,
  onBlur,
  onKeyDown,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex items-center gap-2" onSubmit={onSubmit}>
      <Folder className="size-4" />
      <Input
        autoFocus
        aria-label="New folder name"
        className="h-8 min-w-0 flex-1"
        maxLength={80}
        name="name"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="New folder"
        value={value}
      />
    </form>
  );
}

export function RenameFolderForm({
  slug,
  name,
  value,
  onChange,
  onBlur,
  onKeyDown,
  onSubmit,
}: {
  slug: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex w-full items-center gap-2 pl-8" onSubmit={onSubmit}>
      <input name="slug" type="hidden" value={slug} />
      <Folder className="size-4 shrink-0" />
      <Input
        autoFocus
        aria-label={`Rename ${name}`}
        className="h-8 w-full flex-1"
        maxLength={80}
        name="name"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        value={value}
      />
    </form>
  );
}

export function RenameNoteForm({
  slug,
  title,
  value,
  onChange,
  onBlur,
  onKeyDown,
  onSubmit,
}: {
  slug: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex min-w-0 items-center gap-2" onSubmit={onSubmit}>
      <input name="slug" type="hidden" value={slug} />
      <FileText className="ml-3 size-4 shrink-0" />
      <Input
        autoFocus
        aria-label={`Rename ${title}`}
        className="h-7 min-w-0 flex-1"
        maxLength={120}
        name="title"
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        value={value}
      />
    </form>
  );
}
