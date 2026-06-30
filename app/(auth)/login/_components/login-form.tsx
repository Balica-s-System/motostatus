"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd, Loader2 } from "lucide-react"; // Importado o Loader2 para o spinner
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/toast-service";
import { cn } from "@/lib/utils";
import {
  type LoginInputType,
  loginSchema,
} from "@/lib/zod-schemas/login-schema";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const callbackURL = searchParams?.get("callbackURL") || "/onboarding";

  const [googlePending, startGooglePending] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const isAnyPending = googlePending || emailPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
  });

  function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    startGooglePending(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        fetchOptions: {
          onSuccess: () => {
            notify.success("Login com o Google efetuado, redirecionando...");
          },
          onError: () => {
            notify.error("Erro interno no servidor ao tentar autenticar.");
          },
        },
      });
    });
  }

  const onSubmit = (data: LoginInputType) => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            const redirectTo =
              callbackURL !== "/onboarding" ? callbackURL : undefined;

            notify.success("E-mail de verificação enviado!");

            router.push(
              `/verify-request?email=${encodeURIComponent(data.email)}${
                redirectTo
                  ? `&callbackURL=${encodeURIComponent(redirectTo)}`
                  : ""
              }`,
            );
          },
          onError: () => {
            notify.error("Erro ao enviar o e-mail de verificação.");
          },
        },
      });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Moto Status</span>
            </Link>
            <h1 className="text-xl font-bold">Bem-vindo a Moto Status</h1>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              disabled={isAnyPending}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field>
            {/* Botão Principal com Spinner */}
            <Button type="submit" disabled={isAnyPending}>
              {emailPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Entrar na Conta"
              )}
            </Button>
          </Field>

          <FieldSeparator>Ou</FieldSeparator>

          <Field>
            {/* Botão Google com Spinner condicional */}
            <Button
              variant="outline"
              type="button"
              onClick={signInWithGoogle}
              disabled={isAnyPending}
            >
              {googlePending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4 mr-2"
                >
                  <title>Google Logo</title>
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {googlePending ? "Conectando..." : "Entrar com Google"}
            </Button>
          </Field>

          <Field>
            <Button variant="outline" type="button" disabled={isAnyPending}>
              Entrar com Apple
            </Button>
          </Field>

          <Field>
            <Button variant="outline" type="button" disabled={isAnyPending}>
              Entrar com GitHub
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{" "}
        <Link href="#">Termos de Serviço</Link> e{" "}
        <Link href="#">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  );
}
