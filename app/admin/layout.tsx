// made toprevent non admin to see the UI
import { requireAdmin } from "@/lib/auth/auth-utils";
import { notFound, redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  if (!user) {
    return redirect("/login");
  }

  if (user.role !== "ADMIN") {
    return notFound();
  }

  return (
    <main>
      {children}
    </main>
  );
}