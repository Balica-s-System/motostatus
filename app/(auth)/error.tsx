"use client";

import { ErrorPage } from "@/components/general/error-page";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Erro de Autenticação"
      message="Ocorreu um erro ao verificar sua sessão. Tente fazer login novamente."
      primaryAction={{
        label: "Ir para o Login",
        href: "/login",
      }}
      showBackButton={false}
    />
  );
}
