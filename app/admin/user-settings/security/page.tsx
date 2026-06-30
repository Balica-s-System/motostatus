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
import { ChangePasswordForm } from "./_components/change-password-form";
import { DangerZone } from "./_components/danger-zone";
import { SessionsManager } from "./_components/sessions-manager";
import { TwoFactorSection } from "./_components/two-factor-section";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const activeSessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-xl font-bold">
            Segurança da Conta
          </CardTitle>
          <CardDescription>
            Proteja sua conta alterando sua senha, gerenciando sessões e
            ativando o 2FA.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-6 overflow-y-auto space-y-8">
          <ChangePasswordForm />

          <SessionsManager
            sessions={activeSessions}
            currentSessionId={session.session.id}
          />

          <TwoFactorSection
            user={{
              id: session.user.id,
              twoFactorEnabled: (session.user as any).twoFactorEnabled ?? false,
            }}
          />

          <DangerZone />
        </CardContent>
      </Card>
    </div>
  );
}
