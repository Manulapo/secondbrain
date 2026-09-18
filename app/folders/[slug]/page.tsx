import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { getFolderBySlug } from "@/lib/folders/queries";
import { FileText, Notebook } from "lucide-react";
import { cn } from "cn";

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

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
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
          <section className="rounded-2xl border border-border bg-card px-5 shadow-sm">
            <ul className="border-border">
              {folder.notes.map((note) => (
                <li key={note.id}>
                  <Link
                    className={cn(
                      "block py-4 font-medium text-muted-foreground transition hover:px-2 hover:text-foreground group/note-link flex items-center gap-2",
                      folder.notes.length > 1 && "border-b border-border/20",
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
        </div>
      </div>
    </main>
  );
}
