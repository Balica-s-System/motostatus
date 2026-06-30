import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { acceptShareableInvite } from "@/lib/data/shareable-invite";

const acceptSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = acceptSchema.parse(body);

    const result = await acceptShareableInvite(token);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Token inválido", "BAD_REQUEST");
    }
    return handleApiError(error);
  }
}
