import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const folders = await db.orm.public.Folder.where((folder) =>
    folder.notes.some((note) => note.publishedAt.isNull()),
  )
    .include("notes", (notes) =>
      notes
        .where((note) => note.publishedAt.isNull())
        .select("title", "createdAt", "id", "slug")
        .orderBy((note) => note.createdAt.desc())
        .limit(3),
    )
    .all();

  const totalNotesNumber = await db.orm.public.Note.groupBy("folderId")
    .having((group) => group.count().gte(1))
    .aggregate((agg) => ({ total: agg.count(), oldest: agg.min("createdAt") }));

  if (folders.length === 0) {
    return <div>No folders found</div>;
  }

  return (
    <main>
      <p>Total notes: {totalNotesNumber?.[0].total}</p>
      <p>Oldest note: {totalNotesNumber?.[0].oldest}</p>
      <p>Oldest note in folder: {totalNotesNumber?.[0].folderId}</p>
      {folders.map((folder) => (
        <div key={folder.id}>
          <b>Folder: {folder.name}</b>
          <p>{folder.createdAt}</p>
          {folder.notes.map((note) => (
            <div className="ml-2" key={note.id}>
              <h2> - {note.title}</h2>
              <Link href={`/notes/${note.slug}`}> go to note</Link>
              <div>{note.createdAt}</div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
