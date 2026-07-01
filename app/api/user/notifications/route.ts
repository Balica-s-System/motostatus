import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  securityAlerts: z.boolean(),
  organizationInvites: z.boolean(),
  marketingUpdates: z.boolean(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return apiError("Não autorizado", "UNAUTHORIZED");
    }

    const body = await request.json();
    const input = notificationSettingsSchema.parse(body);

    await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      update: input,
      create: { userId: session.user.id, ...input },
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Dados inválidos", "BAD_REQUEST", error.issues);
    }
    return handleApiError(error);
  }
}
