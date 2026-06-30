import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { acceptInvitation } from "@/lib/data/member";

const acceptSchema = z.object({
  invitationId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId } = acceptSchema.parse(body);

    await acceptInvitation(invitationId);
    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
