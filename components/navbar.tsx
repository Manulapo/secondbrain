import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth/auth-utils";

export async function Navbar() {
  const currentUser = await getCurrentUser();
  const username = currentUser?.username ?? "";
  const displayName = username
    ? `${username.charAt(0).toUpperCase()}${username.slice(1)}`
    : "User";

  return (
    <nav className="flex h-14 items-center justify-end border-b px-4 h-16">
      {currentUser ? (
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
          >
            {displayName.charAt(0)}
          </span>
          <span className="text-sm text-muted-foreground">{displayName}</span>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Link
            className="rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            href="/login"
          >
            Log in
          </Link>
          <Link
            className="rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            href="/signup"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
