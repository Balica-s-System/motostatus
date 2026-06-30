import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    await prisma.notificationSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        emailEnabled: body.emailEnabled,
        whatsappEnabled: body.whatsappEnabled,
        inAppEnabled: body.inAppEnabled,
        securityAlerts: body.securityAlerts,
        organizationInvites: body.organizationInvites,
        marketingUpdates: body.marketingUpdates,
      },
      create: {
        userId: session.user.id,
        emailEnabled: body.emailEnabled,
        whatsappEnabled: body.whatsappEnabled,
        inAppEnabled: body.inAppEnabled,
        securityAlerts: body.securityAlerts,
        organizationInvites: body.organizationInvites,
        marketingUpdates: body.marketingUpdates,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
