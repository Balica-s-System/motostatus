"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Mail, MessageSquare, ShieldAlert, Users } from "lucide-react";
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
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/toast-service";

const notificationFormSchema = z.object({
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  securityAlerts: z.boolean(),
  organizationInvites: z.boolean(),
  marketingUpdates: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface NotificationFormProps {
  initialData: NotificationFormValues;
}

export function NotificationForm({ initialData }: NotificationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: NotificationFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error();
      }

      notify.success("Preferências de notificação atualizadas!");
      router.refresh();
    } catch {
      notify.error("Erro ao salvar alterações.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl"
      >
        {/* Seção 1: Canais de Comunicação */}
        <div>
          <h3 className="text-md font-medium text-foreground">
            Canais de Comunicação
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Escolha por onde você deseja receber as suas notificações.
          </p>

          <div className="space-y-4 rounded-lg border p-4 bg-card/50">
            <FormField
              control={form.control}
              name="inAppEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md p-2">
                  <div className="space-y-0.5 flex gap-3 items-start">
                    <Bell className="mt-1 text-muted-foreground" size={18} />
                    <div>
                      <FormLabel className="text-sm font-medium">
                        Na plataforma (In-App)
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Exibir alertas na central de notificações dentro do
                        painel.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="emailEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md p-2">
                  <div className="space-y-0.5 flex gap-3 items-start">
                    <Mail className="mt-1 text-muted-foreground" size={18} />
                    <div>
                      <FormLabel className="text-sm font-medium">
                        E-mail
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Enviar resumos e alertas importantes para o seu e-mail
                        cadastrado.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="whatsappEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md p-2">
                  <div className="space-y-0.5 flex gap-3 items-start">
                    <MessageSquare
                      className="mt-1 text-muted-foreground"
                      size={18}
                    />
                    <div>
                      <FormLabel className="text-sm font-medium">
                        WhatsApp
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Receber alertas urgentes e relatórios direto no seu
                        celular.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Seção 2: Tipos de Notificação */}
        <div>
          <h3 className="text-md font-medium text-foreground">
            Alertas de Eventos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione quais categorias de eventos disparam notificações.
          </p>

          <div className="space-y-4 rounded-lg border p-4 bg-card/50">
            <FormField
              control={form.control}
              name="organizationInvites"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md p-2">
                  <div className="space-y-0.5 flex gap-3 items-start">
                    <Users className="mt-1 text-muted-foreground" size={18} />
                    <div>
                      <FormLabel className="text-sm font-medium">
                        Convites de Organização
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Avisar quando você for convidado para entrar em uma nova
                        empresa.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="securityAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md p-2">
                  <div className="space-y-0.5 flex gap-3 items-start">
                    <ShieldAlert
                      className="mt-1 text-muted-foreground"
                      size={18}
                    />
                    <div>
                      <FormLabel className="text-sm font-medium">
                        Segurança da Conta
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Alertar sobre novos logins detectados ou alterações
                        cadastrais essenciais.
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
