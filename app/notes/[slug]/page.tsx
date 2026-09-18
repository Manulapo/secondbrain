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

  return (
    <main className="min-h-screen px-6 py-12 text-foreground sm:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-4 font-semibold">{note.title}</header>
        <section className="mt-4 rounded-2xl borderp-1 shadow-sm sm:p-8">
          <div className="whitespace-pre-wrap text-regular leading-3 text-card-foreground">
            {note.content}
          </div>
        </section>
      </article>
    </main>
  );
}
