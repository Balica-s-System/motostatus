import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error";
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
    return handleApiError(error);
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
    return handleApiError(error);
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
    return handleApiError(error);
  }
}
