import { getDealership } from "@/lib/data/dealership";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealership = await getDealership(slug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{dealership.name}</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral da concessionária
        </p>
      </div>
    </div>
  );
}
