import "server-only";
import { headers } from "next/headers";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "./auth";

export async function listPendingInvitations() {
  const session = await getCurrentSession();

  const invitations = await auth.api.listUserInvitations({
    query: { email: session.user.email },
    headers: await headers(),
  });

  return invitations;
}

export async function acceptInvitation(invitationId: string) {
  const session = await getCurrentSession();

  await auth.api.acceptInvitation({
    body: { invitationId },
    headers: await headers(),
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingCompleted: true },
  });

  const member = await prisma.member.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (member) {
    await auth.api.setActiveOrganization({
      body: { organizationId: member.organizationId },
      headers: await headers(),
    });
  }
}

export async function listOrganizationMembers(slug: string) {
  const session = await getCurrentSession();

  const org = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!org) throw new NotFoundError("Concessionária não encontrada");

  const currentMember = await prisma.member.findFirst({
    where: { organizationId: org.id, userId: session.user.id },
    select: { id: true },
  });

  if (!currentMember) throw new ForbiddenError();

  const members = await prisma.member.findMany({
    where: { organizationId: org.id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return members.map((m) => ({
    id: m.id,
    role: m.role,
    createdAt: m.createdAt,
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    image: m.user.image,
  }));
}
