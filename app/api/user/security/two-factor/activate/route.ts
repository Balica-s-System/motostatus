import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";

const activateSchema = z.object({
  code: z.string().min(6, "Código deve ter pelo menos 6 dígitos"),
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("Não autorizado", "UNAUTHORIZED");

    const body = await request.json();
    const { code } = activateSchema.parse(body);

    await auth.api.verifyTOTP({
      body: { code },
      headers: request.headers,
    });

    await auth.api.enableTwoFactor({
      body: { issuer: "Moto Status" },
      headers: request.headers,
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Dados inválidos", "BAD_REQUEST", error.issues);
    }
    return handleApiError(error);
  }
}
