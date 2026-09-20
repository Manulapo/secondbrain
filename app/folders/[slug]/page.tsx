import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { getFolderBySlug } from "@/lib/folders/queries";
import { isMocNote } from "@/lib/utils";
import { cn } from "cn";
import { FileText } from "lucide-react";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const folder = await getFolderBySlug(slug);

  if (!folder) {
    notFound();
  }

  const moc = folder.notes.find((note) => isMocNote(note.title));
  const notes = folder.notes.filter((note) => !isMocNote(note.title));

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-8">
      <div>
        <header className="border-b border-border pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Folder
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {folder.name}
            </h1>
            {folder.parent && (
              <Link
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                href={`/folders/${folder.parent.slug}`}
              >
                ← Back to {folder.parent.name}
              </Link>
            )}
          </div>
        </header>

        <div className="mt-8 space-y-6">
          {moc ? (
            <section className="rounded-2xl border border-border bg-card px-5 py-6 shadow-sm sm:px-8">
              <MarkdownRenderer>{moc.content}</MarkdownRenderer>
            </section>
          ) : null}

          {notes.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card px-5 shadow-sm">
              <ul className="border-border">
                {notes.map((note) => (
                  <li key={note.id}>
                    <Link
                      className={cn(
                        "block py-4 font-medium text-muted-foreground transition hover:px-2 hover:text-foreground group/note-link flex items-center gap-2",
                        notes.length > 1 && "border-b border-border/20",
                      )}
                      href={`/notes/${note.slug}`}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {note.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
