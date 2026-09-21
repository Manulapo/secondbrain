import "server-only";

import { User } from "better-auth";
import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "../db";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    // Read the incoming request headers so Better Auth can inspect the session cookie.
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    return null;
  }

  const user = await db.orm.public.User.where({ id: userId }).first();

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
