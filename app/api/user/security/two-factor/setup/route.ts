import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const authApi = auth.api as any;

  try {
    const totpData = await authApi.generateTwoFactorSecret({
      headers: request.headers,
    });

    return Response.json({ totpURI: totpData.uri });
  } catch (error) {
    return Response.json(
      { error: "Erro ao gerar segredo do 2FA" },
      { status: 500 },
    );
  }
}
