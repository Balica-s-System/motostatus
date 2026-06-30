import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { listPendingInvitations } from "@/lib/data/member";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const invitations = await listPendingInvitations();

    return Response.json({
      invitations: invitations,
      hasName: !!session.user.name && session.user.name.trim() !== "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
