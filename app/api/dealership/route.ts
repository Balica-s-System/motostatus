import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { createDealership, listUserDealerships } from "@/lib/data/dealership";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dealership = await createDealership(body);
    return Response.json(dealership, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: "Dados inválidos", issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "CNPJ já cadastrado") {
        return Response.json({ error: error.message }, { status: 409 });
      }
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orgs = await listUserDealerships();
    return Response.json(orgs);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
