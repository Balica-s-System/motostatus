import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./_components/profile-form";

export default async function Page() {
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
    // min-h mudou para a altura exata restante, e tiramos o item-center para não achatar o card no meio
    <div className="flex flex-col h-[calc(100vh-5.5rem)] w-full">
      <Card className="w-full h-full flex flex-col rounded-xl border">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-xl font-bold">
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        {/* Adicionado flex-1 para o conteúdo do formulário preencher a altura interna do card */}
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
