import { ArrowUpRight, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";

import { PageLayout } from "@/components/page-layout";
import { getFolders } from "@/lib/folders/queries";
import { getNotes } from "@/lib/notes/queries";
import { isMOCNote } from "@/lib/utils";

export default async function Home() {
  const [folders, notes] = await Promise.all([getFolders(), getNotes()]);

  const visibleNotes = notes.filter((note) => !isMOCNote(note.title));
  const recentNotes = visibleNotes.slice(0, 6);

  return (
    <PageLayout className="lg:py-16">
      <header className="max-w-2xl border-b border-border pb-8 sm:pb-10">
        <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
          A calm place for your ideas.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
          Browse the published folders and notes in this personal knowledge
          base.
        </p>
      </header>

      <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0" aria-labelledby="folders-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {folders.length}{" "}
                {folders.length === 1 ? "collection" : "collections"}
              </p>
              <h2
                id="folders-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Explore folders
              </h2>
            </div>
            <FolderOpen
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {folders.map((folder) => {
              const folderNotes = folder.notes.filter(
                (note) => !isMOCNote(note.title),
              );

              return (
                <Link
                  key={folder.id}
                  href={`/folders/${folder.slug}`}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <FolderOpen
                      className="mt-0.5 size-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 break-words font-semibold">
                    {folder.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {folderNotes.length}{" "}
                    {folderNotes.length === 1 ? "note" : "notes"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="min-w-0" aria-labelledby="recent-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {visibleNotes.length} published{" "}
                {visibleNotes.length === 1 ? "note" : "notes"}
              </p>
              <h2
                id="recent-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Recently added
              </h2>
            </div>
            <FileText
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card px-4 shadow-sm sm:px-5">
            {recentNotes.length > 0 ? (
              <ul>
                {recentNotes.map((note) => (
                  <li
                    key={note.id}
                    className="border-b border-border last:border-0"
                  >
                    <Link
                      href={`/notes/${note.slug}`}
                      className="group flex items-center gap-3 py-4"
                    >
                      <FileText
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium transition group-hover:text-muted-foreground">
                          {note.title}
                        </span>
                        {note.folder ? (
                          <span className="block truncate text-sm text-muted-foreground">
                            {note.folder.name}
                          </span>
                        ) : null}
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">
                The published folders contain the available material.
              </p>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
