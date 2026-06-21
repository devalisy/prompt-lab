import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));

    if (!q.trim()) return apiResponse({ prompts: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    if (q.length > 200) return errorResponse("استعلام البحث طويل جداً", 400);

    const where: Record<string, unknown> = {
      isPublic: true,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
        { description: { contains: q } },
      ],
    };

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { usageCount: "desc" },
        include: {
          category: true,
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.prompt.count({ where }),
    ]);

    return apiResponse({
      prompts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل البحث", 500);
  }
}
