"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Shield, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(50, { message: "O nome não pode passar de 50 caracteres." }),
  image: z
    .string()
    .url({ message: "Insira uma URL válida para a imagem." })
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: {
    name: string | null;
    image: string | null;
    email: string;
    emailVerified: boolean;
    role: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialData.name ?? "",
      image: initialData.image ?? "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seção de Informações de Conta (Apenas Leitura) */}
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Endereço de E-mail</FormLabel>
            <FormControl>
              <Input
                value={initialData.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </FormControl>
            <FormDescription>
              O e-mail é gerenciado pela sua conta de autenticação e não pode
              ser alterado aqui.
            </FormDescription>
          </FormItem>

          {/* Badges de Status da Conta */}
          <div className="flex flex-wrap gap-2 pt-1">
            {initialData.emailVerified ? (
              <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-2.5 py-1 rounded-md font-medium border border-emerald-500/20">
                <BadgeCheck size={14} />
                E-mail Verificado
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-500 dark:text-amber-400 px-2.5 py-1 rounded-md font-medium border border-amber-500/20">
                <XCircle size={14} />
                E-mail Não Verificado
              </div>
            )}

            {initialData.role && (
              <div className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-500 dark:text-blue-400 px-2.5 py-1 rounded-md font-medium border border-blue-500/20 uppercase">
                <Shield size={14} />
                Nível: {initialData.role}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Campos Editáveis */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Exibição</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormDescription>
                Este é o nome que aparecerá na sua sidebar e nos registros do
                sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Foto de Perfil</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemplo.com/suafoto.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Insira o endereço público da sua imagem de avatar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
