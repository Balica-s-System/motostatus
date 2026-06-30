import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  deleteDealership,
  getDealership,
  updateDealership,
} from "@/lib/data/dealership";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const dealership = await getDealership(slug);
    return Response.json(dealership);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden") {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      if (error.message === "Dealership not found") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const dealership = await updateDealership(slug, body);
    return Response.json(dealership);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden: only admin or owner can update") {
        return Response.json({ error: error.message }, { status: 403 });
      }
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    await deleteDealership(slug);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message === "Forbidden: only owner can delete") {
        return Response.json({ error: error.message }, { status: 403 });
      }
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
