import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const [promptsCount, savedCount, likesReceived, commentsCount] = await Promise.all([
      prisma.prompt.count({ where: { authorId: user.id } }),
      prisma.savedPrompt.count({ where: { userId: user.id } }),
      prisma.like.count({ where: { prompt: { authorId: user.id } } }),
      prisma.comment.count({ where: { userId: user.id } }),
    ]);

    return apiResponse({
      promptsCount,
      savedCount,
      likesReceived,
      commentsCount,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب الإحصائيات", 500);
  }
}
