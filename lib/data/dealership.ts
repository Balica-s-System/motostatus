import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createDealershipSchema,
  updateDealershipSchema,
} from "@/lib/validations/dealership";
import { getCurrentSession } from "./auth";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function createDealership(rawInput: unknown) {
  const session = await getCurrentSession();

  const input = createDealershipSchema.parse(rawInput);

  const existing = await prisma.organization.findUnique({
    where: { cnpj: input.cnpj },
    select: { id: true },
  });
  if (existing) throw new Error("CNPJ já cadastrado");

  const slug = generateSlug(input.name);

  const org = await auth.api.createOrganization({
    body: {
      name: input.name,
      slug,
      logo: input.logo ?? null,
    },
    headers: await headers(),
  });

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      cnpj: input.cnpj,
      phone: input.phone,
      website: input.website || null,
      description: input.description || null,
    },
  });

  await auth.api.setActiveOrganization({
    body: { organizationId: org.id },
    headers: await headers(),
  });

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
  };
}

export async function getDealership(slug: string) {
  const session = await getCurrentSession();

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId: session.user.id },
        select: { id: true, role: true },
      },
    },
  });

  if (!org) throw new Error("Dealership not found");
  if (org.members.length === 0) throw new Error("Forbidden");

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logo: org.logo,
    cnpj: org.cnpj,
    phone: org.phone,
    website: org.website,
    description: org.description,
    createdAt: org.createdAt,
    role: org.members[0].role,
  };
}

export async function updateDealership(slug: string, rawInput: unknown) {
  const session = await getCurrentSession();
  const input = updateDealershipSchema.parse(rawInput);

  const member = await prisma.member.findFirst({
    where: {
      organization: { slug },
      userId: session.user.id,
      role: { in: ["owner", "admin"] },
    },
  });
  if (!member) throw new Error("Forbidden: only admin or owner can update");

  const org = await prisma.organization.update({
    where: { slug },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.logo !== undefined && { logo: input.logo }),
      ...(input.cnpj && { cnpj: input.cnpj }),
      ...(input.phone && { phone: input.phone }),
      ...(input.website !== undefined && { website: input.website || null }),
      ...(input.description !== undefined && {
        description: input.description || null,
      }),
    },
  });

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
  };
}

export async function deleteDealership(slug: string) {
  const session = await getCurrentSession();

  const member = await prisma.member.findFirst({
    where: {
      organization: { slug },
      userId: session.user.id,
      role: "owner",
    },
  });
  if (!member) throw new Error("Forbidden: only owner can delete");

  await auth.api.deleteOrganization({
    body: { organizationId: member.organizationId },
    headers: await headers(),
  });
}

export async function listUserDealerships() {
  const session = await getCurrentSession();

  const members = await prisma.member.findMany({
    where: { userId: session.user.id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          cnpj: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return members.map((m) => ({
    ...m.organization,
    role: m.role,
  }));
}
