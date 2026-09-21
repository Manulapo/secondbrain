import { NoteActions } from "@/components/notes/note-actions";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { getCurrentUser } from "@/lib/auth/auth-utils";
import { getNoteBySlug } from "@/lib/notes/queries";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/page-layout";

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
    <PageLayout>
      <article className="mx-auto">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-4 font-semibold">
          <h1>{note.title}</h1>
        </header>
        {isAdmin ? (
          <div className="sticky bg-card/95 max-w-fit rounded-lg top-10 right-0 z-20 -mt-11 flex justify-end ml-auto px-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/40">
            <NoteActions slug={note.slug} title={note.title} />
          </div>
        ) : null}
        <section className="mt-4 rounded-2xl borderp-1 shadow-sm sm:p-8">
          <MarkdownRenderer>{note.content}</MarkdownRenderer>
        </section>
      </article>
    </PageLayout>
  );
}
