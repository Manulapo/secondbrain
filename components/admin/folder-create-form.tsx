"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createFolder } from "@/app/admin/folders/actions";
import { getActionErrorMessage } from "@/lib/action-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FolderCreateForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);

    try {
      await createFolder(new FormData(form));
      form.reset();
      toast.success("Folder created.");
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="mt-5 flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="folder-name">
        Folder name
      </label>
      <Input
        id="folder-name"
        maxLength={80}
        name="name"
        placeholder="e.g. Programming"
        required
      />
      <Button className="sm:w-auto" disabled={pending} type="submit">
        {pending ? "Creating..." : "Create folder"}
      </Button>
    </form>
  );
}
