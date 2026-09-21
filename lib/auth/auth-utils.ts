import "server-only";

import { headers } from "next/headers";
import { db } from "../db";
import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    // Read the incoming request headers so Better Auth can inspect the session cookie.
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = await db.orm.public.User.where({
    email: session.user.email,
  }).first();

  return user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}
