"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Upload } from "lucide-react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast-service";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(14, "CNPJ deve ter 14 dígitos")),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .transform((v) => v.replace(/\D/g, "")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().max(300, "Máximo de 300 caracteres"),
  logo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  slug: string;
  defaultValues: FormValues;
  logoUrl: string | null;
}

export function ProfileForm({
  slug,
  defaultValues,
  logoUrl,
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(logoUrl);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const descriptionValue = form.watch("description");

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/dealership/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          logo: logoPreview ?? undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/session-expired");
        return;
      }

      if (res.status === 403) {
        router.push("/forbidden");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        notify.error(
          typeof err.error === "string" ? err.error : "Erro ao salvar",
        );
        return;
      }

      notify.success("Informações atualizadas com sucesso!");
      router.refresh();
    } catch {
      notify.error("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h3 className="text-lg font-medium">Perfil da Concessionária</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as informações da sua concessionária.
          </p>
        </div>

        <FormField
          control={form.control}
          name="logo"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem className="flex flex-col items-start gap-4 space-y-0 border-b pb-6">
              <FormLabel>Logotipo</FormLabel>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 overflow-hidden">
                  {logoPreview ? (
                    <Image
                      width="100"
                      height="100"
                      src={logoPreview}
                      alt="Preview da Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground/60" />
                  )}
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => handleLogoChange(e, onChange)}
                      {...fieldProps}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium cursor-pointer bg-background hover:bg-accent transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Alterar Imagem
                    </label>
                  </div>
                </FormControl>
              </div>
              <FormDescription>
                Formatos suportados: PNG ou JPG. Máximo de 2MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-background"
                  placeholder="Ex: Moto Status"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-background"
                    placeholder="00.000.000/0001-00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone / WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-background"
                    placeholder="(88) 99999-9999"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-background"
                  type="url"
                  placeholder="https://suaempresa.com.br"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="resize-none bg-background"
                  placeholder="Conte um pouco sobre os serviços ou a história da sua empresa..."
                />
              </FormControl>
              <FormDescription className="text-right">
                {descriptionValue?.length || 0}/300 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex pt-2 items-center justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
