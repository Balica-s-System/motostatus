"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome da empresa deve ter pelo menos 3 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "Insira um CNPJ válido.",
  }),
  phone: z.string().min(10, {
    message: "Insira um telefone válido com DDD.",
  }),
  website: z
    .string()
    .url({
      message: "Por favor, insira uma URL válida.",
    })
    .optional()
    .or(z.literal("")),
  description: z.string().max(300, {
    message: "A descrição não pode passar de 300 caracteres.",
  }),
  logo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function OrganizationForm() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      phone: "",
      website: "",
      description: "",
    },
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
      const res = await fetch("/api/dealership", {
        method: "POST",
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
        const message =
          typeof err.error === "string"
            ? err.error
            : "Erro ao criar concessionária";
        toast.error(message);
        return;
      }

      toast.success("Concessionária criada com sucesso!");
      router.push("/admin");
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <h3 className="text-lg font-medium">Perfil da Organização</h3>
            <p className="text-sm text-muted-foreground">
              Configure os dados gerais da concessionária.
            </p>
          </div>

          <FormField
            control={form.control}
            name="logo"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="flex flex-col items-start gap-4 space-y-0 border-b pb-6">
                <FormLabel>Logotipo da Empresa</FormLabel>
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
                        Selecionar Imagem
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
            {/* CNPJ */}
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

            {/* Telefone */}
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

          {/* Website Link (Opcional) */}
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

          {/* Descrição */}
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

          <div className="flex pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
