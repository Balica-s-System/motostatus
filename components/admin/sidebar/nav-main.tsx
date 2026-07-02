"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  return (
    <>
      {items.map((item, index) => (
        <NavMainItem key={item.title || item.label || index} item={item} />
      ))}
    </>
  );
}

function NavMainItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;

  const isUrlActive = (href?: string) => {
    if (!href) return false;
    if (pathname === href) return true;
    if (hasChildren && pathname.startsWith(`${href}/`)) return true;
    return false;
  };

  const isParentActive = hasChildren
    ? item.children?.some((child) => isUrlActive(child.href))
    : isUrlActive(item.href);

  const [isOpen, setIsOpen] = React.useState(isParentActive);

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
  const pathname = usePathname();
  const isCurrentActive = pathname === item.href;

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
