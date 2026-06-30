import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    if (!name || name.trim().length < 2) {
      return Response.json({ error: "Nome inválido" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name.trim(),
        image: image && image.trim() !== "" ? image.trim() : null,
      },
    });

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar informações no banco:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
