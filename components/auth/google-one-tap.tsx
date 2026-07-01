"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function GoogleOneTap() {
  const router = useRouter();

  useEffect(() => {
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          router.push("/onboarding");
        },
      },
    });
  }, [router]);

  return null;
}
