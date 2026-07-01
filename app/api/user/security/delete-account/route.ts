import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    await prisma.$transaction([
      prisma.shareableInvite.deleteMany({ where: { createdById: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
