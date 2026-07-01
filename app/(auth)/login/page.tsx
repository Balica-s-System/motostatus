import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export const metadata = {
  title: "Login - Moto Status",
  description: "Sistema de gestão para concessionárias.",
};

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    if (!session.user.onboardingCompleted) {
      return redirect("/onboarding");
    }
    return redirect("/dashboard");
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
