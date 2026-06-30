"use client";

import { Laptop, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/toast-service";

interface SessionData {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

interface SessionsManagerProps {
  sessions: SessionData[];
  currentSessionId: string;
}

export function SessionsManager({
  sessions,
  currentSessionId,
}: SessionsManagerProps) {
  const router = useRouter();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleRevokeSession(id: string) {
    setRevokingId(id);
    try {
      const res = await fetch("/api/user/security/revoke-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      });

      if (!res.ok) throw new Error();

      notify.success("Dispositivo desconectado com sucesso.");
      router.refresh();
    } catch {
      notify.error("Erro ao desconectar dispositivo.");
    } finally {
      setRevokingId(null);
    }
  }

  // Função simples para adivinhar o dispositivo baseado no userAgent
  function getDeviceIcon(userAgent: string | null) {
    const ua = userAgent?.toLowerCase() || "";
    if (
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("ipad")
    ) {
      return <Smartphone className="text-muted-foreground" size={20} />;
    }
    return <Laptop className="text-muted-foreground" size={20} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium text-foreground">
          Dispositivos Conectados
        </h3>
        <p className="text-sm text-muted-foreground">
          Estas são as sessões que estão ativas na sua conta atualmente.
        </p>
      </div>

      <div className="rounded-lg border bg-card/50 divide-y">
        {sessions.map((session) => {
          const isCurrent = session.id === currentSessionId;

          return (
            <div
              key={session.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getDeviceIcon(session.userAgent)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {session.userAgent
                        ? session.userAgent.split(" ")[0]
                        : "Dispositivo Desconhecido"}
                    </p>
                    {isCurrent && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                        Este dispositivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    IP: {session.ipAddress || "Não registrado"} • Conectado em:{" "}
                    {new Date(session.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {!isCurrent && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={revokingId === session.id}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
