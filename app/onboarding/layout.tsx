"use client";

import { LogOut } from "lucide-react";
import { ModeToggle } from "@/components/theming/ModeToggle";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/user-signout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleSignOut = useSignOut();

  return (
    <div className="relative">
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="cursor-pointer absolute top-6 right-6 group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        Sair
      </Button>
      {children}

      <div className="absolute top-6 left-6">
        <ModeToggle />
      </div>
    </div>
  );
}
