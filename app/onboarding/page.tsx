import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentSession, getOrgDashboardUrl } from "@/lib/data/auth";
import OnboardingForm from "./_components/onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding | Moto Status",
  description:
    "Selecione como deseja começar no Moto Status: criando uma nova organização ou configurando seu perfil de membro.",
  robots: {
    index: false,
    follow: false,
  },
};

function OnboardingSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="size-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function OnboardingContent() {
  const session = await getCurrentSession();
  if (session.user.onboardingCompleted) {
    redirect(await getOrgDashboardUrl());
  }

  return <OnboardingForm />;
}

export default function Page() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingContent />
    </Suspense>
  );
}
