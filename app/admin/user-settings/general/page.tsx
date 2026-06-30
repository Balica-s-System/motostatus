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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] w-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
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
