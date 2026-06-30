"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Importa o hook de rotas do Next.js
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  // Limpeza dos estados manuais redundantes
  return (
    <>
      {items.map((item, index) => (
        <NavMainItem key={item.title || item.label || index} item={item} />
      ))}
    </>
  );
}

function NavMainItem({ item }: { item: NavItem }) {
  const pathname = usePathname(); // 2. Captura a URL atual na barra de endereço
  const hasChildren = !!item.children?.length;

  // Função para checar se o link exato ou uma sub-rota está ativa
  const isUrlActive = (href?: string) => {
    if (!href) return false;
    // Retorna verdadeiro se a rota atual for idêntica ou se estender o caminho do link
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Se o item tem filhos, ele fica ativo se algum dos sub-itens estiver ativo
  const isParentActive = hasChildren
    ? item.children?.some((child) => isUrlActive(child.href))
    : isUrlActive(item.href);

  const [isOpen, setIsOpen] = React.useState(isParentActive);

  // Garante que o menu retrátil permaneça aberto se a rota ativa pertencer a um de seus filhos
  React.useEffect(() => {
    if (isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  if (item.isSection && item.label) {
    return (
      <SidebarGroup className="p-0 pt-5 first:pt-0">
        <SidebarGroupLabel className="p-0 text-xs font-medium uppercase text-sidebar-foreground">
          {item.label}
        </SidebarGroupLabel>
      </SidebarGroup>
    );
  }

  // Item com filhos colapsáveis
  if (hasChildren && item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  id={`nav-main-trigger-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  tooltip={item.title}
                  isActive={isParentActive}
                  className={cn(
                    "rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer w-full",
                    isParentActive
                      ? "bg-primary! text-primary-foreground!"
                      : "",
                  )}
                >
                  {item.icon && <item.icon size={16} />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={cn(
                      "ml-auto transition-transform duration-200",
                      isOpen && "rotate-90",
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="me-0 pe-0">
                  {item.children!.map((child, index) => (
                    <NavMainSubItem key={child.title || index} item={child} />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Item terminal comum (Link Direto)
  if (item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              id={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              tooltip={item.title}
              isActive={isParentActive}
              className={cn(
                "rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                isParentActive ? "bg-primary! text-primary-foreground!" : "",
              )}
              asChild
            >
              <Link href={item.href ?? "/"}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return null;
}

function NavMainSubItem({ item }: { item: NavItem }) {
  const pathname = usePathname(); // 3. Captura a URL atual para os sub-itens
  const isCurrentActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(`${item.href}/`));

  if (item.title) {
    return (
      <SidebarMenuSubItem className="w-full">
        <SidebarMenuSubButton
          id={`nav-sub-button-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
          className={cn(
            "w-full rounded-md transition-colors",
            isCurrentActive ? "bg-muted! text-foreground! font-semibold" : "",
          )}
          isActive={isCurrentActive}
          asChild
        >
          <Link href={item.href ?? "/"}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return null;
}
