import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const saved = await prisma.savedPrompt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        prompt: {
          include: {
            category: true,
            author: { select: { id: true, name: true, image: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });

    return apiResponse(saved);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب المحفوظات", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { promptId } = await request.json();
    if (!promptId) return errorResponse("معرف البرومت مطلوب", 400);

    const existing = await prisma.savedPrompt.findUnique({
      where: { userId_promptId: { userId: user.id, promptId } },
    });
    if (existing) return errorResponse("البرومت محفوظ مسبقاً", 409);

    const saved = await prisma.savedPrompt.create({
      data: { userId: user.id, promptId },
    });

    return apiResponse(saved, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حفظ البرومت", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { promptId } = await request.json();
    if (!promptId) return errorResponse("معرف البرومت مطلوب", 400);

    await prisma.savedPrompt.delete({
      where: { userId_promptId: { userId: user.id, promptId } },
    });

    return apiResponse({ message: "تمت إزالة الحفظ" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إزالة الحفظ", 500);
  }
}
