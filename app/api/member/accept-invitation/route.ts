import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { acceptInvitation } from "@/lib/data/member";
import { prisma } from "@/lib/prisma";

const acceptSchema = z.object({
  invitationId: z.string().min(1, "O ID do convite é obrigatório."),
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { invitationId, name } = acceptSchema.parse(body);

    if (name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name.trim(),
          onboardingCompleted: true,
        },
      });
    }

    await acceptInvitation(invitationId);

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
