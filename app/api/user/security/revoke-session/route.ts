import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const revokeSchema = z.object({
  sessionId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("Não autorizado", "UNAUTHORIZED");

    const body = await request.json();
    const { sessionId } = revokeSchema.parse(body);

    await prisma.session.deleteMany({
      where: { id: sessionId, userId: session.user.id },
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Dados inválidos", "BAD_REQUEST", error.issues);
    }
    return handleApiError(error);
  }
}
