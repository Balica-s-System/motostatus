import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data/auth";
import { listUserDealerships } from "@/lib/data/dealership";
import { InviteDialog } from "./_components/invite-dialog";

export default async function AdminPage() {
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
            <div
              key={org.id}
              className="rounded-lg border p-4 flex items-center justify-between"
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
