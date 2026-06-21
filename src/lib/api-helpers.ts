import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function getAuthUser() {
  const session = await auth();
  return session?.user ?? null;
}
