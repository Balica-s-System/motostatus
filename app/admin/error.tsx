"use client";

import { ErrorPage } from "@/components/general/error-page";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Erro no Painel"
      message="Ocorreu um erro ao carregar o painel administrativo. Tente novamente."
      primaryAction={{
        label: "Tentar Novamente",
        href: "#",
      }}
      secondaryAction={{
        label: "Voltar ao Início",
        href: "/",
      }}
      showBackButton={false}
    />
  );
}
