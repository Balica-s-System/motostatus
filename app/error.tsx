"use client";

import { ErrorPage } from "@/components/general/error-page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Erro Interno"
      message="Algo de errado aconteceu. Tente novamente mais tarde."
      primaryAction={{
        label: "Tentar Novamente",
        href: "#",
      }}
      showBackButton={false}
    />
  );
}
