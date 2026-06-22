import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const [totalUsers, totalPrompts, totalCategories, totalLikes, totalComments] = await Promise.all([
      prisma.user.count(),
      prisma.prompt.count(),
      prisma.category.count(),
      prisma.like.count(),
      prisma.comment.count(),
    ]);

    const categoryDistribution = await prisma.category.findMany({
      select: { id: true, name: true, _count: { select: { prompts: true } } },
      orderBy: { sortOrder: "asc" },
    });

    const recentPrompts = await prisma.prompt.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: { select: { name: true } },
        _count: { select: { likes: true } },
      },
    });

    const recentEvents = await prisma.eventLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        message: true,
        userId: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }).catch(() => []);

    return apiResponse({
      total: { users: totalUsers, prompts: totalPrompts, categories: totalCategories, likes: totalLikes, comments: totalComments },
      categoryDistribution: categoryDistribution.map((c) => ({ id: c.id, name: c.name, count: c._count.prompts })),
      recentPrompts,
      recentEvents,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب الإحصائيات", 500);
  }
}
