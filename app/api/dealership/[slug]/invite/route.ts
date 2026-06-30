import type { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { inviteMember } from "@/lib/data/invite";

const inviteSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { email } = inviteSchema.parse(body);

    const invitation = await inviteMember(slug, email);
    return Response.json(invitation, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
