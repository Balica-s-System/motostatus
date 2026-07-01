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

export const navData: NavItem[] = [
  { label: "Dashboards", isSection: true },
  { title: "Analytics", icon: PieChart, href: "/dashboard" },
  { title: "CRM Dashboard", icon: ClipboardList, href: "/crm" },

  { label: "Páginas", isSection: true },
  { title: "BDC", icon: ClipboardList, href: "/dashboard/bdc" },
  { title: "Logística", icon: BoxIcon, href: "/dashboard/logistics" },
  { title: "Página Pública", icon: ArrowBigUpDashIcon, href: "/publica" },

  { label: "Configurações", isSection: true },
  {
    title: "Perfil",
    icon: User2Icon,
    href: "/dashboard/settings/profile",
  },
  { title: "Time", icon: Users2Icon, href: "/dashboard/settings/time" },

  { label: "Configurações de Usuário", isSection: true },
  { title: "Geral", icon: Settings2, href: "/dashboard/user-settings/general" },
  {
    title: "Notificações",
    icon: Bell,
    href: "/dashboard/user-settings/notifications",
  },
  { title: "Segurança", icon: Lock, href: "/dashboard/user-settings/security" },
];

export function AppSidebar() {
  return (
    <Sidebar className="px-0 h-full **:data-[slot=sidebar-inner]:h-full">
      <div className="flex flex-col gap-6">
        <SidebarHeader className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              {/* Modificado para usar asChild padrão do Radix UI */}
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
