import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCurrentSession, getOrgDashboardUrl } from "@/lib/data/auth";
import { MemberForm } from "./_components/member-form";

function MemberSkeleton() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
    </main>
  );
}

async function MemberContent() {
  const session = await getCurrentSession();
  if (session.user.onboardingCompleted) {
    redirect(await getOrgDashboardUrl());
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <MemberForm />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<MemberSkeleton />}>
      <MemberContent />
    </Suspense>
  );
}
