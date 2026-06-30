import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { ModeToggle } from "@/components/theming/ModeToggle";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSignOut } from "@/hooks/user-signout";
import { getCurrentUser } from "@/lib/data/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 justify-between items-center border-b px-4">
          <SidebarTrigger className="cursor-pointer" />

          <div className="flex gap-x-4">
            <ModeToggle />
            <Button
              variant="destructive"
              className="cursor-pointer group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              Sair
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
