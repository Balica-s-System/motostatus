import { Home, KeyRound, type LucideIcon, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/general/back-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
  icon?: LucideIcon;
  accentIcon?: LucideIcon;
  primaryAction?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  showBackButton?: boolean;
}

export function ErrorPage({
  code,
  title,
  message,
  icon: Icon = ShieldAlert,
  accentIcon: AccentIcon = KeyRound,
  primaryAction = { label: "Voltar ao Início", href: "/", icon: Home },
  secondaryAction,
  showBackButton = true,
}: ErrorPageProps) {
  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center font-sans">
      <div className="text-center px-6 max-w-lg">
        <div className="relative inline-block mb-8">
          <Icon className="w-24 h-24 text-amber-500 animate-pulse" />
          <AccentIcon className="w-10 h-10 text-destructive absolute -top-2 -right-4 rotate-12" />
        </div>

        <h1 className="text-9xl font-extrabold text-amber-500 tracking-widest">
          {code}
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mt-4 mb-2">
          {title}
        </h2>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryAction.href}
            className={cn(
              buttonVariants({ variant: "default" }),
              "font-bold px-6 py-6 rounded-lg shadow-lg flex items-center justify-center gap-2 text-base",
            )}
          >
            {primaryAction.icon && <primaryAction.icon className="w-5 h-5" />}
            {primaryAction.label}
          </Link>

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "font-bold px-6 py-6 rounded-lg shadow-lg flex items-center justify-center gap-2 text-base",
              )}
            >
              {secondaryAction.icon && (
                <secondaryAction.icon className="w-5 h-5" />
              )}
              {secondaryAction.label}
            </Link>
          )}

          {showBackButton && !secondaryAction && <BackButton />}
        </div>

        <div className="mt-16 text-xs text-muted-foreground/60 uppercase tracking-widest">
          Moto Status &copy; 2026
        </div>
      </div>
    </div>
  );
}
