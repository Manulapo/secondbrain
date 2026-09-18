"use client";

import { Pencil, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { getActionErrorMessage } from "@/lib/action-error";

import { deleteFolder, updateFolder } from "./actions";

type FolderRowProps = {
  id: number;
  name: string;
  slug: string;
};

export function FolderRow({ id, name, slug }: FolderRowProps) {
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateFolder(new FormData(event.currentTarget));
      setEditing(false);
      toast.success("Folder renamed.");
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      const formData = new FormData();
      formData.set("slug", slug);
      await deleteFolder(formData);
      setDeleteOpen(false);
      toast.success("Folder deleted.");
    } catch (error) {
      toast.error(getActionErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4" key={id}>
      <div className="w-full">
        <p className="font-mono text-sm text-muted-foreground mb-2">/{slug}</p>
        {editing ? (
          <div className="flex items-center w-full">
            <form
              onSubmit={handleSave}
              className="flex items-center gap-1 w-full"
            >
              <input name="slug" type="hidden" value={slug} />
              <Input
                aria-label={`Rename ${name}`}
                autoFocus
                className="h-9"
                defaultValue={name}
                maxLength={80}
                name="name"
                required
              />
              <Button
                aria-label={`Save ${name}`}
                className="h-8 w-8 cursor-pointer ml-auto"
                size="icon"
                type="submit"
                variant="outline"
              >
                <Save />
              </Button>
            </form>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={
                  <Button
                    aria-label={`Delete ${name}`}
                    className="ml-1 h-8 w-full cursor-pointer border border-destructive/40 px-4"
                    size="icon"
                    type="button"
                    variant="destructive"
                  />
                }
              >
                Delete Folder
                <Trash2 className="ml-2 h-4 w-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The folder will be permanently
                    deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleting}
                    onClick={handleDelete}
                    variant="destructive"
                  >
                    {deleting ? "Deleting..." : "Delete folder"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <p className="font-medium">{name}</p>
              <Button
                aria-label={`Edit ${name}`}
                className="h-8 w-8"
                onClick={() => setEditing(true)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Pencil />
              </Button>
            </div>
            <Link
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href={`/folders/${slug}`}
            >
              View →
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}
