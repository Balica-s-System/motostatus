import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/api-error";
import {
  createShareableInvite,
  validateShareableInvite,
} from "@/lib/data/shareable-invite";

const createSchema = z.object({
  organizationSlug: z.string().min(1),
});

const validateSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationSlug } = createSchema.parse(body);

    const result = await createShareableInvite(organizationSlug);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Dados inválidos", "BAD_REQUEST");
    }
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { token } = validateSchema.parse({
      token: searchParams.get("token"),
    });

    const result = await validateShareableInvite(token);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Token inválido", "BAD_REQUEST");
    }
    return handleApiError(error);
  }
}
