"use client";

import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const routes = [
  { label: "Visão Geral", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Entregas", href: "/deliveries", icon: "ShoppingBag" },
  { label: "Frota", href: "/fleet", icon: "Truck" },
  { label: "Clientes", href: "/clients", icon: "Users" },
  { label: "BDC", href: "/bdc", icon: "Package" },
  { label: "Estoque", href: "/stock", icon: "Warehouse" },
  { label: "Config. Gerais", href: "/settings/general", icon: "Settings" },
  { label: "Equipe", href: "/settings/team", icon: "Users" },
  { label: "Faturamento", href: "/settings/billing", icon: "CreditCard" },
];

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const params = useParams<{ dealershipId: string }>();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(`/app/${params.dealershipId}${href}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search size={16} />
        <span className="flex-1 text-left">Pesquisar...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Pesquisar páginas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {routes.map((route) => (
              <CommandItem
                key={route.href}
                onSelect={() => runCommand(route.href)}
              >
                <span>{route.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
