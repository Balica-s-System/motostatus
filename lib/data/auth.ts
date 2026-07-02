import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { UnauthorizedError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export const getOrgDashboardUrl = cache(async (): Promise<string> => {
  const session = await getCurrentSession();

  if (session.session.activeOrganizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: session.session.activeOrganizationId },
      select: { slug: true },
    });
    if (org) return `/admin/${org.slug}/dashboard`;
  }

  const membership = await prisma.member.findFirst({
    where: { userId: session.user.id },
    select: { organization: { select: { slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (membership) return `/admin/${membership.organization.slug}/dashboard`;

  return "/admin";
});
