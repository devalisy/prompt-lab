import { NextRequest } from "next/server";
import { z } from "zod";
import { apiResponse, errorResponse } from "@/lib/api-helpers";
import { analyzeWithAI } from "@/lib/ai-generator";

const analyzeSchema = z.object({
  content: z.string().min(1).max(10000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyzeSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const result = await analyzeWithAI(parsed.data.content);
    return apiResponse(result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تحليل البرومت", 500);
  }
}
