import "server-only";
import { headers } from "next/headers";
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
