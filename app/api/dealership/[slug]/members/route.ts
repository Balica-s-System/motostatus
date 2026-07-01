import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { listOrganizationMembers } from "@/lib/data/member";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const members = await listOrganizationMembers(slug);
    return Response.json(members);
  } catch (error) {
    return handleApiError(error);
  }
}
