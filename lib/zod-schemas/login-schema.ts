import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
});

export type LoginInputType = z.infer<typeof loginSchema>;
