"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/toast-service";

export function DangerZone() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleDeleteAccount() {
    if (confirmationText !== "DELETAR") return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/security/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      notify.success("Sua conta foi excluída permanentemente.");

      // Força o Better Auth a limpar os estados locais e joga para a landing page/login
      router.push("/login");
      router.refresh();
    } catch {
      notify.error("Erro ao tentar excluir a conta.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-md font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle size={18} />
            Zona de Perigo
          </h3>
          <p className="text-sm text-muted-foreground">
            Excluir sua conta removerá permanentemente todos os seus dados,
            organizações vinculadas e históricos. Esta ação não pode ser
            desfeita.
          </p>
        </div>

        {/* Modal de Confirmação Estrita do shadcn */}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full sm:w-auto cursor-pointer font-medium"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir Conta
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-md p-6 border-destructive/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-destructive">
                Você tem certeza absoluta?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
                Esta ação é irreversível. Ao confirmar, você perderá acesso
                imediatamente a todos os ambientes administrativos do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2 py-4">
              <Label
                htmlFor="confirm-input"
                className="text-xs font-semibold text-foreground"
              >
                Para confirmar, digite{" "}
                <span className="font-bold text-destructive">DELETAR</span> no
                campo abaixo:
              </Label>
              <Input
                id="confirm-input"
                placeholder="DELETAR"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="border-destructive/20 focus-visible:ring-destructive"
              />
            </div>

            <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <AlertDialogCancel asChild>
                <Button
                  variant="outline"
                  onClick={() => setConfirmationText("")}
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmationText !== "DELETAR" || isDeleting}
                className="cursor-pointer"
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir permanentemente"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
