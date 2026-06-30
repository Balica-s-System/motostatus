import { AlertTriangle, Bug } from "lucide-react";
import type { Metadata } from "next";
import { ErrorPage } from "@/components/general/error-page";

export const metadata: Metadata = {
  title: "Erro Interno | Moto Status",
  description: "Ocorreu um erro inesperado no servidor do Moto Status.",
  robots: { index: false, follow: false },
};

export default function ErrorPageRoute() {
  return (
    <ErrorPage
      code="500"
      title="Erro no Servidor!"
      message="Parece que algo deu errado nos motores da oficina. Nossa equipe já foi notificada e está trabalhando para resolver. Tente novamente mais tarde."
      icon={AlertTriangle}
      accentIcon={Bug}
      showBackButton={false}
    />
  );
}
