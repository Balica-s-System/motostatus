import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { UnauthorizedError } from "@/lib/api-error";
import { auth } from "@/lib/auth";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
});

export const requireAuth = cache(async () => {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
});

export const getCurrentSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new UnauthorizedError();
  return session;
});
