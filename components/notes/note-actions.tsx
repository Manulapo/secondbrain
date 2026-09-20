"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteNote } from "@/app/admin/notes/actions";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { getActionErrorMessage } from "@/lib/action-error";

export function NoteActions({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const formData = new FormData();
      formData.set("slug", slug);
      await deleteNote(formData);
      toast.success("Note deleted.");
      router.push("/");
    } catch (error) {
      toast.error(getActionErrorMessage(error));
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label={`Edit ${title}`}
        nativeButton={false}
        render={<Link href={`/admin/notes/${slug}`} />}
        size="icon"
        title={`Edit ${title}`}
        variant="ghost"
      >
        <Pencil />
      </Button>

      <DeleteConfirmationDialog
        deleting={deleting}
        itemName={title}
        itemType="note"
        onConfirm={handleDelete}
      >
        <Button
          aria-label={`Delete ${title}`}
          disabled={deleting}
          size="icon"
          title={`Delete ${title}`}
          variant="ghost"
        >
          <Trash2 className="text-destructive" />
        </Button>
      </DeleteConfirmationDialog>
    </div>
  );
}
