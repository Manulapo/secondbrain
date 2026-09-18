import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";

import { createFolder } from "./actions";

export default async function AdminFoldersPage() {
  const folders = await db.orm.public.Folder.orderBy((folder) =>
    folder.createdAt.desc(),
  ).all();

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Admin / Folders
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Manage folders
          </h1>
          <p className="text-muted-foreground">
            Create the containers that organize your notes.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">New folder</h2>
          <form
            action={createFolder}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="folder-name">
              Folder name
            </label>
            <Input
              id="folder-name"
              maxLength={80}
              name="name"
              placeholder="e.g. Programming"
              required
            />
            <Button className="sm:w-auto" type="submit">
              Create folder
            </Button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold">Existing folders</h2>
            <span className="text-sm text-muted-foreground">
              {folders.length} {folders.length === 1 ? "folder" : "folders"}
            </span>
          </div>

          {folders.length > 0 ? (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
              {folders.map((folder) => (
                <li
                  className="flex items-center justify-between gap-4 px-5 py-4"
                  key={folder.id}
                >
                  <div>
                    <p className="font-medium">{folder.name}</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      /{folder.slug}
                    </p>
                  </div>
                  <Link
                    className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    href={`/folders/${folder.slug}`}
                  >
                    View →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
              No folders yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
