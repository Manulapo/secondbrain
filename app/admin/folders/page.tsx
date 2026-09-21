import { getAdminFolders } from "@/lib/folders/queries";
import { FolderCreateForm } from "@/components/admin/folder-create-form";
import { PageLayout } from "@/components/page-layout";

import { FolderRow } from "./folder-row";

export default async function AdminFoldersPage() {
  const folders = await getAdminFolders();

  return (
    <PageLayout>
      <div className="space-y-10">
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
          <FolderCreateForm />
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
                <FolderRow
                  key={folder.id}
                  id={folder.id}
                  name={folder.name}
                  slug={folder.slug}
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
              No folders yet.
            </p>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
