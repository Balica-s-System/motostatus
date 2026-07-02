import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logística</CardTitle>
        <p className="text-sm text-muted-foreground">{slug}</p>
      </CardHeader>
    </Card>
  );
}
