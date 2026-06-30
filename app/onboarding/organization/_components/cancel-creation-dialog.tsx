"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CancelCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelCreationDialog({
  open,
  onOpenChange,
}: CancelCreationDialogProps) {
  const router = useRouter();

  function handleConfirm() {
    router.push("/onboarding");
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja sair da criação da organização?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Todas as informações preenchidas serão perdidas caso você saia
            agora.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Continuar criando</AlertDialogCancel>

          <AlertDialogAction onClick={handleConfirm}>Sair</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
