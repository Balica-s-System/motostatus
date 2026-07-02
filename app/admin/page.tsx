import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data/auth";
import { listUserDealerships } from "@/lib/data/dealership";
import { InviteDialog } from "./_components/invite-dialog";

function AdminPageSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="space-y-2 text-center">
        <Skeleton className="h-9 w-32 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>
      <div className="mt-8 w-full max-w-md space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-24 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

async function AdminContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orgs = await listUserDealerships();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-muted-foreground">Bem-vindo, {user.name}</p>

      {orgs.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Você ainda não possui uma concessionária.
          </p>
          <Link
            href="/onboarding/organization"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Criar concessionária
          </Link>
        </div>
      ) : (
        <div className="mt-8 w-full max-w-md space-y-4">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/admin/${org.slug}/dashboard`}
              className="rounded-lg border p-4 flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold">{org.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {org.cnpj} — {org.phone}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Seu papel: {org.role}
                </p>
              </div>

              {(org.role === "owner" || org.role === "admin") && (
                <InviteDialog
                  organizationSlug={org.slug}
                  organizationName={org.name}
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}
