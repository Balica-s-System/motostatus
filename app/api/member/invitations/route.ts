import { handleApiError } from "@/lib/api-error";
import { listPendingInvitations } from "@/lib/data/member";

export async function GET() {
  try {
    const invitations = await listPendingInvitations();
    return Response.json(invitations);
  } catch (error) {
    return handleApiError(error);
  }
}
