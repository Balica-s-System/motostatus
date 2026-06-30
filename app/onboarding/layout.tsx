"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/theming/ModeToggle";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/user-signout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSubPage = pathname !== "/onboarding";
  const router = useRouter();
  const handleSignOut = useSignOut();

  return (
    <div className="relative min-h-screen">
      {isSubPage && (
        <Button
          onClick={() => router.push("/onboarding")}
          variant="ghost"
          className="absolute top-6 left-6 z-10 flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
      )}

      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <ModeToggle />
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="cursor-pointer group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Sair
        </Button>
      </div>

      {children}
    </div>
  );
}
