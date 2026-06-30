import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { createDealership, listUserDealerships } from "@/lib/data/dealership";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dealership = await createDealership(body);
    return Response.json(dealership, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const orgs = await listUserDealerships();
    return Response.json(orgs);
  } catch (error) {
    return handleApiError(error);
  }
}
