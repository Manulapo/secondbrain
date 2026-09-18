import Link from "next/link";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const note = await db.orm.public.Note
    .where({ slug })
    .where((note) => note.publishedAt.isNotNull())
    .include("folder")
    .first();

  if (!note) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Note
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-4 font-mono text-sm text-muted-foreground">/{note.slug}</p>
          {note.folder && note.folder.publishedAt && (
            <Link
              className="mt-6 inline-block text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href={`/folders/${note.folder.slug}`}
            >
              ← Back to {note.folder.name}
            </Link>
          )}
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="whitespace-pre-wrap text-base leading-8 text-card-foreground">
            {note.content}
          </div>
        </section>
      </article>
    </main>
  );
}
