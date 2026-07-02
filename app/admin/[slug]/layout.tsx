import { Suspense } from "react";
import { headers } from "next/headers";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { getCurrentSession } from "@/lib/data/auth";
import { prisma } from "@/lib/prisma";

async function OrgValidator({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const currentSession = await getCurrentSession();

  const [org, membership] = await Promise.all([
    prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    }),
    prisma.member.findFirst({
      where: {
        organization: { slug },
        userId: currentSession.user.id,
      },
      select: { id: true },
    }),
  ]);

  if (!org || !membership) {
    throw new Error("NOT_FOUND");
  }

  if (org.id !== currentSession.session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      body: { organizationId: org.id },
      headers: await headers(),
    });
  }

  return <>{children}</>;
}

function OrgLayoutSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="mt-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default async function OrgLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<OrgLayoutSkeleton />}>
      <OrgValidator slug={slug}>{children}</OrgValidator>
    </Suspense>
  );
}
