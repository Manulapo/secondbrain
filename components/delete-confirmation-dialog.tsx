"use client";

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
import type { DeleteConfirmationDialogProps } from "@/types/ui.types";

export function DeleteConfirmationDialog({
  itemName,
  itemType,
  deleting = false,
  onConfirm,
  children,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const dialog = (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{itemName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The {itemType} will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={onConfirm}
            variant="destructive"
          >
            {deleting ? "Deleting..." : `Delete ${itemType}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children ? <AlertDialogTrigger render={children} /> : null}
      {dialog}
    </AlertDialog>
  );
}
