"use client";

import { Copy, Link, Loader, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/toast-service";

interface InviteDialogProps {
  organizationSlug: string;
  organizationName: string;
}

export function InviteDialog({
  organizationSlug,
  organizationName,
}: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const handleSendInvitation = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      notify.warn("Por favor, insira um e-mail válido");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/dealership/${organizationSlug}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (res.status === 401) {
        window.location.href = "/session-expired";
        return;
      }

      if (res.status === 403) {
        window.location.href = "/forbidden";
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        notify.error(err.error || `Erro ao convidar ${trimmedEmail}`);
        return;
      }

      notify.success(`Convite enviado para ${trimmedEmail}`);
      setEmail("");
      setOpen(false);
    } catch {
      notify.error("Erro de conexão ao enviar o convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    try {
      const res = await fetch("/api/invite/shareable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationSlug }),
      });

      if (res.status === 401) {
        window.location.href = "/session-expired";
        return;
      }

      if (res.status === 403) {
        window.location.href = "/forbidden";
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        notify.error(err.error || "Erro ao gerar link");
        return;
      }

      const data = await res.json();
      const link = `${window.location.origin}/invite/join/${data.token}`;
      setInviteLink(link);
      setExpiresAt(new Date(data.expiresAt));
      notify.success("Link gerado com sucesso!");
    } catch {
      notify.error("Erro de conexão");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      notify.success("Link copiado para a área de transferência!");
    } catch {
      notify.error("Erro ao copiar o link");
    }
  };

  const formatExpiry = (date: Date) => {
    const now = Date.now();
    const diff = date.getTime() - now;
    const minutes = Math.round(diff / 60000);
    const seconds = Math.round(diff / 1000);

    if (minutes >= 1) return `Expira em ${minutes} min`;
    if (seconds >= 10) return `Expira em ${seconds}s`;
    return "Expirando...";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Convidar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar para {organizationName}</DialogTitle>
          <DialogDescription>
            Convide membros por e-mail ou compartilhe um link de convite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email-invite">E-mail do colaborador</Label>
            <Input
              id="email-invite"
              placeholder="membro@exemplo.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSendInvitation}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Convite por E-mail"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou compartilhe o link
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              className="flex-1 bg-muted/50"
              readOnly
              value={inviteLink}
              placeholder='Clique em "Gerar Link"'
            />
            <Button
              size="sm"
              variant="outline"
              className="gap-2 shrink-0"
              onClick={handleGenerateLink}
              disabled={isGeneratingLink}
            >
              {isGeneratingLink ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Link className="h-4 w-4" />
              )}
              Gerar Link
            </Button>
          </div>

          {inviteLink && (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 w-full"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
                Copiar Link
              </Button>
            </div>
          )}

          {expiresAt && (
            <p className="text-muted-foreground text-xs">
              {formatExpiry(expiresAt)}. Link válido por apenas 10 minutos.
            </p>
          )}

          <p className="text-muted-foreground text-xs leading-normal">
            Qualquer pessoa com este link poderá entrar na equipe{" "}
            {organizationName}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
