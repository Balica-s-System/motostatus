"use client";

import {
  ArrowBigUpDashIcon,
  Bell,
  BoxIcon,
  ClipboardList,
  Lock,
  PieChart,
  Settings2,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavItem, NavMain } from "./nav-main";

function getSlug(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "admin" && segments[1]) {
    return segments[1];
  }
  return null;
}

function buildNavData(slug: string | null): NavItem[] {
  const items: NavItem[] = [
    { label: "Dashboards", isSection: true },
    {
      title: "Visão Geral",
      icon: PieChart,
      href: slug ? `/admin/${slug}/dashboard` : "/admin",
    },
    { title: "CRM Dashboard", icon: ClipboardList, href: "/crm" },
  ];

  if (slug) {
    items.push(
      { label: "Páginas", isSection: true },
      { title: "BDC", icon: ClipboardList, href: `/admin/${slug}/bdc` },
      {
        title: "Logística",
        icon: BoxIcon,
        href: `/admin/${slug}/logistics`,
      },
      { title: "Página Pública", icon: ArrowBigUpDashIcon, href: "#" },
      { label: "Configurações", isSection: true },
      {
        title: "Perfil",
        icon: User2Icon,
        href: `/admin/${slug}/settings/profile`,
      },
      {
        title: "Time",
        icon: Users2Icon,
        href: `/admin/${slug}/settings/time`,
      },
    );
  }

  if (slug) {
    items.push(
      { label: "Configurações de Usuário", isSection: true },
      {
        title: "Geral",
        icon: Settings2,
        href: `/admin/${slug}/user-settings/general`,
      },
      {
        title: "Notificações",
        icon: Bell,
        href: `/admin/${slug}/user-settings/notifications`,
      },
      {
        title: "Segurança",
        icon: Lock,
        href: `/admin/${slug}/user-settings/security`,
      },
    );
  }

  return items;
}

export function AppSidebar() {
  const pathname = usePathname();
  const slug = getSlug(pathname);
  const navData = buildNavData(slug);

  return (
    <Sidebar className="px-0 h-full **:data-[slot=sidebar-inner]:h-full">
      <div className="flex flex-col gap-6">
        <SidebarHeader className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="font-bold">Logo</div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="overflow-hidden">
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="px-4">
              <NavMain items={navData} />
            </div>
          </ScrollArea>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
