import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function BdcSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

async function BdcContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>BDC</CardTitle>
        <p className="text-sm text-muted-foreground">{slug}</p>
      </CardHeader>
    </Card>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BdcSkeleton />}>
      <BdcContent params={params} />
    </Suspense>
  );
}
