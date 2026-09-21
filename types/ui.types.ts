import type { Dispatch, ReactElement, SetStateAction } from "react";

export type FormToolbarProps = {
  formId: string;
  isDirty: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  sidebarWidth: number;
  setSidebarWidth: Dispatch<SetStateAction<number>>;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  toggleSidebar: () => void;
};

export type DeleteConfirmationDialogProps = {
  itemName: string;
  itemType: "folder" | "note";
  deleting?: boolean;
  onConfirm: () => void | Promise<void>;
  children?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
