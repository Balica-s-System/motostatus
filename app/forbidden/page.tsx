import { Ban, LogIn } from "lucide-react";
import type { Metadata } from "next";
import { ErrorPage } from "@/components/general/error-page";

export const metadata: Metadata = {
  title: "Acesso Negado | Moto Status",
  description:
    "Você não tem permissão para acessar este recurso no Moto Status.",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Área Restrita!"
      message="Calma aí, piloto! Você não tem autorização para entrar nesse setor da oficina. Verifique suas credenciais de membro ou mude de rota."
      icon={Ban}
      secondaryAction={{
        label: "Fazer Login",
        href: "/login",
        icon: LogIn,
      }}
    />
  );
}
