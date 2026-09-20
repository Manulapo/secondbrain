"use client";

import type { ReactElement } from "react";

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

type DeleteConfirmationDialogProps = {
  itemName: string;
  itemType: "folder" | "note";
  deleting?: boolean;
  onConfirm: () => void | Promise<void>;
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

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
