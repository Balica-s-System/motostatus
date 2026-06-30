"use client";

import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export const metadata: Metadata = {
  title: "Onboarding | Moto Status",
  description:
    "Selecione como deseja começar no Moto Status: criando uma nova organização ou configurando seu perfil de membro.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingForm() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center ">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Item asChild>
          <Link href="/onboarding/organization">
            <ItemContent>
              <ItemTitle>Criar Organização</ItemTitle>
              <ItemDescription>
                Cadastre sua empresa, concessionária.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
        <Item asChild className="bg-background" variant="outline">
          <Link href="/onboarding/member" rel="noopener noreferrer">
            <ItemContent>
              <ItemTitle>Criar Perfil</ItemTitle>
              <ItemDescription>
                Entre como membro de um grupo existente.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ExternalLinkIcon className="size-4" />
            </ItemActions>
          </Link>
        </Item>
      </div>
    </div>
  );
}
