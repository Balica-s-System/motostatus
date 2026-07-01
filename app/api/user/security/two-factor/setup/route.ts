import { apiError, handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return apiError("Não autorizado", "UNAUTHORIZED");

    const totpData = await auth.api.getTOTPURI({
      body: {},
      headers: request.headers,
    });

    return Response.json({ totpURI: totpData.totpURI });
  } catch (error) {
    return handleApiError(error);
  }
}
