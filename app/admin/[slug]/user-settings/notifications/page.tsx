import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationForm } from "./_components/notification-form";

function NotificationsSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="flex-1 p-6 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function NotificationsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const settings = await prisma.notificationSettings.findUnique({
    where: { userId: session.user.id },
  });

  const initialSettings = {
    emailEnabled: settings?.emailEnabled ?? true,
    whatsappEnabled: settings?.whatsappEnabled ?? false,
    inAppEnabled: settings?.inAppEnabled ?? true,
    securityAlerts: settings?.securityAlerts ?? true,
    organizationInvites: settings?.organizationInvites ?? true,
    marketingUpdates: settings?.marketingUpdates ?? false,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-xl font-bold">Notificações</CardTitle>
          <CardDescription>
            Gerencie como e quando você deseja ser notificado.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-6 overflow-y-auto">
          <NotificationForm initialData={initialSettings} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsContent />
    </Suspense>
  );
}
