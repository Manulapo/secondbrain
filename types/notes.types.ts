export type NoteValidationResult =
  | {
    success: true;
    data: {
      title: string;
      slug: string;
      content: string;
    };
  }
  | {
    success: false;
    error: string;
  };

export type ExplorerNote = { id: string; title: string; slug: string };
