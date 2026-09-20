import { NoteActions } from "@/components/notes/note-actions";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { getCurrentUser } from "@/lib/auth/auth-utils";
import { getNoteBySlug } from "@/lib/notes/queries";
import { notFound } from "next/navigation";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <main className="min-h-screen px-6 py-12 text-foreground sm:px-8">
      <article className="mx-auto">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-4 font-semibold">
          <h1>{note.title}</h1>
          {isAdmin ? <NoteActions slug={note.slug} title={note.title} /> : null}
        </header>
        <section className="mt-4 rounded-2xl borderp-1 shadow-sm sm:p-8">
          <MarkdownRenderer>{note.content}</MarkdownRenderer>
        </section>
      </article>
    </main>
  );
}
