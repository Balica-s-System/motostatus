import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import { auth } from "@/lib/auth";
import { getOrgDashboardUrl } from "@/lib/data/auth";
import { LoginForm } from "./_components/login-form";

export const metadata = {
  title: "Login - Moto Status",
  description: "Sistema de gestão para concessionárias.",
};

function LoginSkeleton() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

async function LoginContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if (!session.user.onboardingCompleted) {
      return redirect("/onboarding");
    }
    return redirect(await getOrgDashboardUrl());
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <GoogleOneTap />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
