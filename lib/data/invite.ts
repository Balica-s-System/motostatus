import "server-only";
import { headers } from "next/headers";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "./auth";

export async function inviteMember(organizationSlug: string, email: string) {
  const session = await getCurrentSession();

  const org = await prisma.organization.findUnique({
    where: { slug: organizationSlug },
    select: { id: true },
  });

  if (!org) throw new NotFoundError("Concessionária não encontrada");

  const member = await prisma.member.findFirst({
    where: {
      organizationId: org.id,
      userId: session.user.id,
      role: { in: ["owner", "admin"] },
    },
    select: { id: true },
  });

  if (!member) {
    throw new ForbiddenError("Apenas administradores podem convidar membros");
  }

  const invitation = await auth.api.createInvitation({
    body: {
      email,
      organizationId: org.id,
      role: "member",
    },
    headers: await headers(),
  });

  return invitation;
}
