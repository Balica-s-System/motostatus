"use client";

import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/toast-service";

interface TwoFactorSectionProps {
  user: {
    id: string;
    twoFactorEnabled?: boolean; // Ajuste baseado no seu schema de User do Better Auth
  };
}

export function TwoFactorSection({ user }: TwoFactorSectionProps) {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(user.twoFactorEnabled || false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "scan">("idle");

  // Estados para o setup do QR Code
  const [qrCodeUri, setQrCodeUri] = useState("");
  const [totpCode, setTotpCode] = useState("");

  // 1. Inicia o fluxo de ativação buscando a URI do QR Code no Better Auth
  async function handleStartSetup() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/security/two-factor/setup", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao iniciar 2FA");

      setQrCodeUri(data.totpURI); // URI padrão: otpauth://totp/...
      setStep("scan");
    } catch (err: any) {
      notify.error(
        err.message || "Não foi possível iniciar a configuração do 2FA.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Confirma o código que o usuário digitou para validar e ativar de vez
  async function handleVerifyAndActivate() {
    if (totpCode.length < 6) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/security/two-factor/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      });

      if (!res.ok) throw new Error();

      notify.success("Autenticação de dois fatores ativada com sucesso!");
      setIsEnabled(true);
      setStep("idle");
      setTotpCode("");
      router.refresh();
    } catch {
      notify.error("Código inválido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Desativa o 2FA
  async function handleDisableTwoFactor() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/security/two-factor/disable", {
        method: "POST",
      });
      if (!res.ok) throw new Error();

      notify.success("2FA desativado.");
      setIsEnabled(false);
      router.refresh();
    } catch {
      notify.error("Erro ao desativar o 2FA.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-md font-medium text-foreground flex items-center gap-2">
            <Shield
              size={18}
              className={
                isEnabled ? "text-emerald-500" : "text-muted-foreground"
              }
            />
            Autenticação de Dois Fatores (2FA)
          </h3>
          <p className="text-sm text-muted-foreground">
            Adicione uma camada extra de segurança confirmando um código pelo
            seu celular ao entrar.
          </p>
        </div>

        {step === "idle" && (
          <Button
            variant={isEnabled ? "outline" : "default"}
            onClick={isEnabled ? handleDisableTwoFactor : handleStartSetup}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isEnabled ? "Desativar 2FA" : "Configurar 2FA"}
          </Button>
        )}
      </div>

      {/* Estado: Usuário já possui 2FA ativo */}
      {isEnabled && step === "idle" && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={20} />
          <p className="text-sm font-medium">
            Sua conta está protegida com autenticação em duas etapas.
          </p>
        </div>
      )}

      {/* Fluxo de Ativação: Escanear QR Code e Inserir Código */}
      {step === "scan" && (
        <div className="p-4 rounded-lg border bg-card/50 max-w-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Render do QR Code limpo via SVG */}
            <div className="bg-white p-3 rounded-lg border flex-shrink-0">
              <QRCodeSVG value={qrCodeUri} size={140} />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-semibold">
                Configure seu autenticador
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                1. Abra seu app de autenticação (Google Authenticator,
                1Password, etc).
                <br />
                2. Escaneie o código QR ao lado ou adicione manualmente.
                <br />
                3. Digite o código de 6 dígitos gerado pelo aplicativo abaixo.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="two-factor-code" className="text-xs">
              Código de Verificação
            </Label>
            <div className="flex gap-3">
              <Input
                id="two-factor-code"
                placeholder="000 000"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="font-mono text-center tracking-widest max-w-[180px]"
              />
              <Button
                onClick={handleVerifyAndActivate}
                disabled={totpCode.length < 6 || isLoading}
                className="flex-1 sm:flex-initial cursor-pointer"
              >
                {isLoading ? "Ativando..." : "Verificar e Ativar"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("idle")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Separator />
    </div>
  );
}
