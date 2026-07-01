import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import UserDropdown from "@/components/admin/user-dropdown";
import { ModeToggle } from "@/components/theming/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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

          <div className="flex items-center gap-x-4">
            <ModeToggle />
            <UserDropdown
              email={user.email}
              name={user.name ?? "Usuário"}
              image={user.image ?? undefined}
            />
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
