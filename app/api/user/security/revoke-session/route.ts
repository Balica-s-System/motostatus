import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await request.json();

  await prisma.session.deleteMany({
    where: { id: sessionId, userId: session.user.id },
  });

  return Response.json({ success: true });
}
