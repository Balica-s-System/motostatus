import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await auth.api.disableTwoFactor({
    headers: request.headers,
  });

  return Response.json({ success: true });
}
