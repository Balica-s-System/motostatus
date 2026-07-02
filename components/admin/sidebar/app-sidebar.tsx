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
  if (
    segments[0] === "dashboard" &&
    segments[1] &&
    segments[1] !== "user-settings"
  ) {
    return segments[1];
  }
  return null;
}

function buildNavData(slug: string | null): NavItem[] {
  const orgBase = slug ? `/dashboard/${slug}` : "/dashboard";

  return [
    { label: "Dashboards", isSection: true },
    { title: "Visão Geral", icon: PieChart, href: orgBase },
    { title: "CRM Dashboard", icon: ClipboardList, href: "/crm" },

    { label: "Páginas", isSection: true },
    {
      title: "BDC",
      icon: ClipboardList,
      href: slug ? `${orgBase}/bdc` : "/dashboard",
    },
    {
      title: "Logística",
      icon: BoxIcon,
      href: slug ? `${orgBase}/logistics` : "/dashboard",
    },
    {
      title: "Página Pública",
      icon: ArrowBigUpDashIcon,
      href: "/publica",
    },

    { label: "Configurações", isSection: true },
    {
      title: "Perfil",
      icon: User2Icon,
      href: slug ? `${orgBase}/settings/profile` : "/dashboard",
    },
    {
      title: "Time",
      icon: Users2Icon,
      href: slug ? `${orgBase}/settings/time` : "/dashboard",
    },

    { label: "Configurações de Usuário", isSection: true },
    {
      title: "Geral",
      icon: Settings2,
      href: "/dashboard/user-settings/general",
    },
    {
      title: "Notificações",
      icon: Bell,
      href: "/dashboard/user-settings/notifications",
    },
    {
      title: "Segurança",
      icon: Lock,
      href: "/dashboard/user-settings/security",
    },
  ];
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
