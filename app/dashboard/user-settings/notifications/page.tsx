import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const settings = await prisma.notificationSettings.findUnique({
    where: { userId: session.user.id },
  });

  // Monta os valores iniciais seguros se o registro for nulo no banco
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
          {/* O formulário foi chamado aqui injetando os dados estruturados */}
          <NotificationForm initialData={initialSettings} />
        </CardContent>
      </Card>
    </div>
  );
}
