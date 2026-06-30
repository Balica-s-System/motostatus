"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      prompt: () => void;
    };
  };
};

export function GoogleOneTap() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (initialized.current) return;
      initialized.current = true;

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

      if (!clientId) return;

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const res = await fetch("/api/auth/google-one-tap", {
              method: "POST",
              body: JSON.stringify({ credential: response.credential }),
              headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
              router.push("/onboarding");
            }
          } catch {
            // Silently fail — user can still use email/Google button
          }
        },
      });

      google.accounts.id.prompt();
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router]);

  return null;
}
