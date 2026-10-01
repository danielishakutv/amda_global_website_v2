import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/admin-server";

export async function GET() {
  return NextResponse.json({ configured: await isConfigured() });
}
