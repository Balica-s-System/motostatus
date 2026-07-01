import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session)
      return Response.json({ error: "Não autorizado" }, { status: 401 });

    await auth.api.disableTwoFactor({
      body: {},
      headers: request.headers,
    });

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
