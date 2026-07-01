import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .transform((v) => v.trim()),
  image: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return apiError("Não autorizado", "UNAUTHORIZED");
    }

    const body = await request.json();
    const input = updateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: input.name,
        image: input.image?.trim() || null,
      },
    });

    return Response.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Dados inválidos", "BAD_REQUEST", error.issues);
    }
    return handleApiError(error);
  }
}
