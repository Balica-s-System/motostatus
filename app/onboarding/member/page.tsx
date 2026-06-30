import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/data/auth";
import { MemberForm } from "./_components/member-form";

export default async function Page() {
  const session = await getCurrentSession();
  if (session.user.onboardingCompleted) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <MemberForm />
    </main>
  );
}
