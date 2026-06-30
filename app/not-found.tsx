import { AlertTriangle, Bike, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/general/back-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Página não encontrada | Moto Status",
    description:
      "O motor falhou ou você pegou o caminho errado. A página que você procura no Moto Status não existe.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function NotFound() {
  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center font-sans">
      <div className="text-center px-6 max-w-lg">
        <div className="relative inline-block mb-8">
          <Bike className="w-24 h-24 text-amber-500 animate-bounce" />
          <AlertTriangle className="w-10 h-10 text-destructive absolute -top-2 -right-4" />
        </div>

        <h1 className="text-9xl font-extrabold text-amber-500 tracking-widest">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mt-4 mb-2">
          Caminho Errado!
        </h2>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Parece que você pegou a saída errada ou o nosso motor falhou por um
          segundo. A página que você está procurando sumiu na fumaça.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "font-bold px-6 py-6 rounded-lg shadow-lg flex items-center justify-center gap-2 text-base",
            )}
          >
            <Home className="w-5 h-5" /> Voltar ao Início
          </Link>

          <BackButton />
        </div>

        <div className="mt-16 text-xs text-muted-foreground/60 uppercase tracking-widest">
          Moto Status &copy; 2026
        </div>
      </div>
    </div>
  );
}
