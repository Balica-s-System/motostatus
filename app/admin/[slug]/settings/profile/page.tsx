import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealership } from "@/lib/data/dealership";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dealership = await getDealership(slug);

  const isAdmin = dealership.role === "owner" || dealership.role === "admin";

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground text-sm">
            Informações da {dealership.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building2 className="size-5" />
              {dealership.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dealership.cnpj && (
              <div>
                <span className="text-muted-foreground">CNPJ:</span>{" "}
                {dealership.cnpj}
              </div>
            )}
            {dealership.phone && (
              <div>
                <span className="text-muted-foreground">Telefone:</span>{" "}
                {dealership.phone}
              </div>
            )}
            {dealership.website && (
              <div>
                <span className="text-muted-foreground">Website:</span>{" "}
                {dealership.website}
              </div>
            )}
            {dealership.description && (
              <div>
                <span className="text-muted-foreground">Descrição:</span>{" "}
                {dealership.description}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as informações da {dealership.name}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProfileForm
            slug={slug}
            defaultValues={{
              name: dealership.name,
              cnpj: dealership.cnpj ?? "",
              phone: dealership.phone ?? "",
              website: dealership.website ?? "",
              description: dealership.description ?? "",
            }}
            logoUrl={dealership.logo}
          />
        </CardContent>
      </Card>
    </div>
  );
}
