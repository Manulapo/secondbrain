import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { getFolderBySlug } from "@/lib/folders/queries";

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
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Browse</p>
                <h2 className="mt-1 text-xl font-semibold">Subfolders</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {folder.children.length}
              </span>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {folder.children.map((child) => (
                <li key={child.id}>
                  <Link
                    className="group flex items-center justify-between rounded-xl border border-border px-4 py-3 font-medium transition hover:border-foreground/20 hover:bg-muted"
                    href={`/folders/${child.slug}`}
                  >
                    {child.name}
                    <span className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <h2 className="mt-1 text-xl font-semibold">Notes</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {folder.notes.length}
              </span>
            </div>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {folder.notes.map((note) => (
                <li key={note.id}>
                  <Link
                    className="block py-4 font-medium text-muted-foreground transition hover:px-2 hover:text-foreground"
                    href={`/notes/${note.slug}`}
                  >
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
