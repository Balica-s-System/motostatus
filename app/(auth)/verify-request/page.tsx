"use client";

import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/toast-service";

export default function VerifyRequestRoute() {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  );
}

function VerifyRequest() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, setEmailTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    setEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            notify.success("E-mail verificado com sucesso");
            router.push("/");
          },
          onError: () => {
            notify.error("Erro ao verificar o e-mail ou código");
          },
        },
      });
    });
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="mx-auto min-w-1/4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verifique seu e-mail</CardTitle>
          <CardDescription>
            Enviamos um código de verificação para o seu endereço de e-mail.
            Abra a mensagem recebida e informe o código abaixo.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <InputOTP
              maxLength={6}
              className="gap-2"
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <p className="text-sm text-muted-foreground">
              Digite o código de 6 dígitos enviado para o seu e-mail
            </p>
          </div>

          <Button
            onClick={verifyOtp}
            disabled={emailPending || !isOtpCompleted}
            className="w-full"
          >
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              "Verificar conta"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
