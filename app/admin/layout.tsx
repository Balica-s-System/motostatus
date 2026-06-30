import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import UserDropdown from "@/components/admin/user-dropdown";
import { ModeToggle } from "@/components/theming/ModeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch("http://localhost:3000/api/user", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (response.ok) {
      user = await response.json();
    }
  } catch (error) {
    console.error("Erro ao carregar dados do usuário na API:", error);
  }

  if (!user || user.error) {
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
