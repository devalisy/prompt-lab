import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { prompts: true } },
      },
    });

    const data = categories.map((cat) => ({
      ...cat,
      promptCount: cat._count.prompts,
    }));

    return apiResponse(data);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب التصنيفات", 500);
  }
}
