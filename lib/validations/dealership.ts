import { z } from "zod";

export const createDealershipSchema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres").max(100),
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
  description: z.string().max(300).optional(),
  logo: z.string().optional(),
});
export type CreateDealershipInput = z.infer<typeof createDealershipSchema>;

export const updateDealershipSchema = createDealershipSchema.partial();
export type UpdateDealershipInput = z.infer<typeof updateDealershipSchema>;
