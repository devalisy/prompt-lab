import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const prompts = await prisma.prompt.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        _count: { select: { likes: true, savedBy: true, comments: true } },
      },
    });

    return apiResponse(prompts);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب برومتات المستخدم", 500);
  }
}
