"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/toast-service";

interface Invitation {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

interface ApiResponse {
  invitations: Invitation[];
  hasName: boolean;
}

export function MemberForm() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [hasName, setHasName] = useState(true); // Default true para evitar flash visual
  const [userName, setUserName] = useState(""); // Novo estado para capturar o nome se faltar
  const [invitationId, setInvitationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/member/invitations")
      .then((res) => {
        if (res.status === 401) throw new Response(null, { status: 401 });
        if (!res.ok) throw new Error();
        return res.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        setInvitations(data.invitations);
        setHasName(data.hasName);
      })
      .catch((err) => {
        if (err instanceof Response && err.status === 401) {
          router.push("/session-expired");
          return;
        }
        notify.error("Erro ao carregar convites");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  async function handleAccept(id: string) {
    // Validação estrita no client-side se o nome for obrigatório
    if (!hasName && (!userName || userName.trim().length < 2)) {
      notify.error("Por favor, preencha seu nome antes de continuar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/member/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: id,
          name: !hasName ? userName.trim() : undefined, // Envia o nome apenas se ele não tiver
        }),
      });

      if (res.status === 401) {
        router.push("/session-expired");
        return;
      }

      if (res.status === 403) {
        router.push("/forbidden");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        notify.error(err.error || "Erro ao aceitar convite");
        return;
      }

      notify.success("Convite aceito com sucesso!");
      router.push("/admin");
    } catch {
      notify.error("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-medium">Entrar como Membro</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aceite um convite para entrar em uma organização.
        </p>
      </div>

      {/* Se o usuário não tiver nome salvo, renderiza este bloco obrigatório no topo */}
      {!isLoading && !hasName && (
        <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 animate-in fade-in-50 duration-200">
          <Label
            htmlFor="onboarding-name"
            className="text-amber-500 dark:text-amber-400 font-semibold"
          >
            Configuração de Perfil Requerida *
          </Label>
          <p className="text-xs text-muted-foreground">
            Como você realizou o login por e-mail, precisamos que defina seu
            nome de exibição antes de ingressar na organização.
          </p>
          <Input
            id="onboarding-name"
            placeholder="Seu nome completo"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-2 bg-background border-amber-500/20 focus-visible:ring-amber-500"
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando convites...</p>
      ) : invitations.length > 0 ? (
        <div className="space-y-3">
          {invitations.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{invite.organizationName}</p>
                <p className="text-sm text-muted-foreground">
                  Papel: {invite.role}
                </p>
              </div>
              <Button
                onClick={() => handleAccept(invite.id)}
                disabled={
                  isSubmitting || (!hasName && userName.trim().length < 2)
                }
              >
                Aceitar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você não possui convites pendentes. Se tiver o ID de um convite,
            cole abaixo.
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="ID do convite"
              value={invitationId}
              onChange={(e) => setInvitationId(e.target.value)}
            />
            <Button
              onClick={() => handleAccept(invitationId)}
              disabled={
                !invitationId ||
                isSubmitting ||
                (!hasName && userName.trim().length < 2)
              }
            >
              Aceitar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
