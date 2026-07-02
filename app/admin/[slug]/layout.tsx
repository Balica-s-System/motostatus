import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCurrentSession } from "@/lib/data/auth";
import { getDealership } from "@/lib/data/dealership";
import { prisma } from "@/lib/prisma";

export default async function OrgLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  const { session } = await getCurrentSession();
  await getDealership(slug);

  const org = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (org && org.id !== session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      body: { organizationId: org.id },
      headers: await headers(),
    });
  }

  return <>{children}</>;
}
