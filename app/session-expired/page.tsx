import { LogIn } from "lucide-react";
import type { Metadata } from "next";
import { ErrorPage } from "@/components/general/error-page";

export const metadata: Metadata = {
  title: "Sessão Expirada | Moto Status",
  description:
    "Sua sessão expirou. Faça login novamente para acessar o Moto Status.",
  robots: { index: false, follow: false },
};

export default function SessionExpiredPage() {
  return (
    <ErrorPage
      code="401"
      title="Sessão Expirada!"
      message="Sua sessão expirou ou você não está autenticado. Faça login novamente para continuar."
      secondaryAction={{
        label: "Fazer Login",
        href: "/login",
        icon: LogIn,
      }}
    />
  );
}
