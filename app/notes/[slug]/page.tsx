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
    .first();

  if (!note) {
    notFound();
  }

  return (
    <main>
      <h1>{note.title}</h1>
      <p>{note.slug}</p>
    </main>
  );
}