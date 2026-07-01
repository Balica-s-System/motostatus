"use client";

import { UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast-service";

interface AcceptButtonProps {
  token: string;
}

export function AcceptButton({ token }: AcceptButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/invite/shareable/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.status === 401) {
        router.push("/session-expired");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        notify.error(err.error || "Erro ao aceitar convite");
        return;
      }

      const data = await res.json();

      if (data.alreadyMember) {
        notify.info("Você já é membro desta organização");
      } else {
        notify.success("Convite aceito com sucesso!");
      }

      router.push("/dashboard");
    } catch {
      notify.error("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      onClick={handleAccept}
      disabled={isSubmitting}
      className="font-bold px-6 py-6 rounded-lg shadow-lg flex items-center justify-center gap-2 text-base"
    >
      <UserCheck className="w-5 h-5" />
      {isSubmitting ? "Aceitando..." : "Aceitar Convite"}
    </Button>
  );
}
