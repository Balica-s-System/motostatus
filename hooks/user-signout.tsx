"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { notify } from "@/lib/toast-service";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          notify.success("Sessão encerrada com sucesso");
        },
        onError: () => {
          notify.error("Failed to sign out");
        },
      },
    });
  };

  return handleSignOut;
}
