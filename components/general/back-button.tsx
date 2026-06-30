"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="font-medium px-6 py-6 rounded-lg flex items-center justify-center gap-2 text-base"
    >
      <ArrowLeft className="w-5 h-5" /> Página Anterior
    </Button>
  );
}
