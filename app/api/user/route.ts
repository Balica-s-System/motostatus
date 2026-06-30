import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return Response.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
