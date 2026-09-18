import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-4 p-8">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <Link className="underline underline-offset-4" href="/admin/folders">
        Manage folders →
      </Link>
    </div>
  );
}
