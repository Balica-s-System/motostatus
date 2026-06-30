"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify } from "@/lib/toast-service";

interface Invitation {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

export function MemberForm() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationId, setInvitationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/member/invitations")
      .then((res) => {
        if (res.status === 401) throw new Response(null, { status: 401 });
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setInvitations(data);
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
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/member/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: id }),
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
    <div className="w-full max-w-md">
      <h2 className="text-lg font-medium">Entrar como Membro</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Aceite um convite para entrar em uma organização.
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Carregando convites...
        </p>
      ) : invitations.length > 0 ? (
        <div className="mt-6 space-y-3">
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
                disabled={isSubmitting}
              >
                Aceitar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
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
              disabled={!invitationId || isSubmitting}
            >
              Aceitar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
