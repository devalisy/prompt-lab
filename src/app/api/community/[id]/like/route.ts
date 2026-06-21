import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt) return errorResponse("البرومت غير موجود", 404);
    if (prompt.authorId === user.id) return errorResponse("لا يمكن الإعجاب ببرومتك الخاص", 400);

    const existing = await prisma.like.findUnique({
      where: { userId_promptId: { userId: user.id, promptId: id } },
    });
    if (existing) return errorResponse("تم الإعجاب مسبقاً", 409);

    const like = await prisma.like.create({
      data: { userId: user.id, promptId: id },
    });

    return apiResponse(like, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل الإعجاب", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    await prisma.like.delete({
      where: { userId_promptId: { userId: user.id, promptId: id } },
    });

    return apiResponse({ message: "تمت إزالة الإعجاب" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إزالة الإعجاب", 500);
  }
}
