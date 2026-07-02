import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./_components/profile-form";

function GeneralSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="flex-1 p-6 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function GeneralContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      image: true,
      email: true,
      emailVerified: true,
      role: true,
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-xl font-bold">
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-y-auto">
          <ProfileForm
            initialData={{
              name: user?.name ?? "",
              image: user?.image ?? "",
              email: user?.email ?? "",
              emailVerified: user?.emailVerified ?? false,
              role: user?.role ?? null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<GeneralSkeleton />}>
      <GeneralContent />
    </Suspense>
  );
}
