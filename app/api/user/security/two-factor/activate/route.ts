import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await request.json();

  await auth.api.enableTwoFactor({
    body: { code },
    headers: request.headers,
  });

  return Response.json({ success: true });
}
