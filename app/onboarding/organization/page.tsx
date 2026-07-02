import { redirect } from "next/navigation";
import { getCurrentSession, getOrgDashboardUrl } from "@/lib/data/auth";
import { OrganizationForm } from "./_components/organization-form";

export default async function Page() {
  const session = await getCurrentSession();
  if (session.user.onboardingCompleted) {
    redirect(await getOrgDashboardUrl());
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <OrganizationForm />
    </main>
  );
}
