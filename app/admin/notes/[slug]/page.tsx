import { NoteEditForm } from "@/components/admin/note-edit-form";
import { getAdminNoteBySlug } from "@/lib/notes/queries";
import { notFound } from "next/navigation";

export default async function AdminNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const note = await getAdminNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-12 text-foreground sm:px-8">
      <article className="mx-auto space-y-4 pb-28">
        <NoteEditForm
          content={note.content}
          folderId={note.folderId}
          originalSlug={note.slug}
          published={note.publishedAt !== null}
          title={note.title}
        />
      </article>
    </main>
  );
}
