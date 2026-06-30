import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";

const bodySchema = z.object({
  credential: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = bodySchema.parse(body);

    const headers = new Headers(request.headers);
    headers.set("Content-Type", "application/json");

    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
        idToken: { token: credential },
      },
      headers,
    });

    if (result instanceof Response) {
      return result;
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Credencial inválida", "BAD_REQUEST");
    }
    return handleApiError(error);
  }
}
