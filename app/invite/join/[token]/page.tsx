import { LogIn, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { ErrorPage } from "@/components/general/error-page";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { AcceptButton } from "./accept-button";

interface Props {
  params: Promise<{ token: string }>;
}

const getInvite = cache(async (token: string) => {
  return prisma.shareableInvite.findUnique({
    where: { token },
    include: {
      organization: { select: { name: true, slug: true } },
      createdBy: { select: { name: true } },
    },
  });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const invite = await getInvite(token);

  if (!invite || invite.revokedAt || invite.expiresAt < new Date()) {
    return {
      title: "Convite Inválido | Moto Status",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Convite para ${invite.organization.name} | Moto Status`,
    description: `Você foi convidado para fazer parte da equipe ${invite.organization.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function InviteJoinPage({ params }: Props) {
  const { token } = await params;

  const invite = await getInvite(token);

  if (!invite) {
    return (
      <ErrorPage
        code=""
        title="Link Inválido!"
        message="Este link de convite não existe. Verifique se o link está correto."
      />
    );
  }

  if (invite.revokedAt) {
    return (
      <ErrorPage
        code=""
        title="Link Revogado!"
        message="Este link de convite foi revogado pelo administrador."
      />
    );
  }

  if (invite.expiresAt < new Date()) {
    return (
      <ErrorPage
        code=""
        title="Link Expirado!"
        message="Este link de convite expirou. Solicite um novo convite ao administrador da concessionária."
        secondaryAction={{
          label: "Voltar ao Início",
          href: "/",
          icon: LogIn,
        }}
      />
    );
  }

  const user = await getCurrentUser();

  if (user) {
    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId: invite.organizationId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (existingMember) {
      return (
        <ErrorPage
          code=""
          title="Você já é membro!"
          message={`Você já faz parte da equipe ${invite.organization.name}.`}
          primaryAction={{
            label: "Ir para o Painel",
            href: "/dashboard",
            icon: UserCheck,
          }}
        />
      );
    }
  }

  const expiresInMinutes = Math.round(
    (invite.expiresAt.getTime() - Date.now()) / 60000,
  );

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center font-sans">
      <div className="text-center px-6 max-w-lg">
        <div className="relative inline-block mb-8">
          <LogIn className="w-24 h-24 text-amber-500" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-wide mb-4">
          Convite para Equipe
        </h1>

        <p className="text-muted-foreground text-lg mb-2 leading-relaxed">
          <strong className="text-foreground">{invite.createdBy.name}</strong>{" "}
          convidou você para fazer parte da equipe da{" "}
          <strong className="text-foreground">
            {invite.organization.name}
          </strong>{" "}
          como <strong className="text-primary">{invite.role}</strong>.
        </p>

        <p className="text-muted-foreground/60 text-sm mb-8">
          Este link expira em{" "}
          {expiresInMinutes < 1
            ? "menos de 1 minuto"
            : `até ${expiresInMinutes} minutos`}
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <AcceptButton token={token} />
          ) : (
            <Link
              href={`/login?callbackURL=/invite/join/${token}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "font-bold px-6 py-6 rounded-lg shadow-lg flex items-center justify-center gap-2 text-base",
              )}
            >
              <LogIn className="w-5 h-5" /> Fazer Login para Aceitar
            </Link>
          )}
        </div>

        <div className="mt-16 text-xs text-muted-foreground/60 uppercase tracking-widest">
          Moto Status &copy; 2026
        </div>
      </div>
    </div>
  );
}
