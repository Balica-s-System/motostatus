import "server-only";
import { headers } from "next/headers";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession, requireAuth } from "./auth";

const INVITE_EXPIRES_IN_SEC = 600;

export async function createShareableInvite(organizationSlug: string) {
  const session = await getCurrentSession();

  const org = await prisma.organization.findUnique({
    where: { slug: organizationSlug },
    select: { id: true, name: true },
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
    throw new ForbiddenError(
      "Apenas administradores podem gerar links de convite",
    );
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + INVITE_EXPIRES_IN_SEC * 1000);

  await prisma.shareableInvite.create({
    data: {
      token,
      organizationId: org.id,
      createdById: session.user.id,
      role: "member",
      expiresAt,
    },
  });

  return { token, expiresAt, organizationName: org.name };
}

export async function validateShareableInvite(token: string) {
  const invite = await prisma.shareableInvite.findUnique({
    where: { token },
    include: {
      organization: {
        select: { name: true, slug: true },
      },
    },
  });

  if (!invite) throw new NotFoundError("Link de convite não encontrado");

  if (invite.revokedAt) {
    throw new NotFoundError("Este link de convite foi revogado");
  }

  if (invite.expiresAt < new Date()) {
    throw new NotFoundError("Este link de convite expirou");
  }

  const memberCount = await prisma.member.count({
    where: { organizationId: invite.organizationId },
  });

  return {
    organizationName: invite.organization.name,
    organizationSlug: invite.organization.slug,
    role: invite.role,
    expiresAt: invite.expiresAt,
    memberCount,
  };
}

export async function acceptShareableInvite(token: string) {
  const user = await requireAuth();

  const invite = await prisma.shareableInvite.findUnique({
    where: { token },
    include: {
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  if (!invite) throw new NotFoundError("Link de convite não encontrado");
  if (invite.revokedAt) throw new NotFoundError("Link de convite revogado");
  if (invite.expiresAt < new Date()) throw new NotFoundError("Link expirado");

  const existingMember = await prisma.member.findFirst({
    where: {
      organizationId: invite.organizationId,
      userId: user.id,
    },
    select: { id: true },
  });

  if (existingMember) {
    return {
      alreadyMember: true,
      organizationName: invite.organization.name,
    };
  }

  await prisma.member.create({
    data: {
      id: crypto.randomUUID(),
      organizationId: invite.organizationId,
      userId: user.id,
      role: invite.role,
      createdAt: new Date(),
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  });

  await auth.api.setActiveOrganization({
    body: { organizationId: invite.organizationId },
    headers: await headers(),
  });

  return {
    alreadyMember: false,
    organizationName: invite.organization.name,
  };
}
