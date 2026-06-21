import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const updatePromptSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { likes: true, savedBy: true, comments: true } },
      },
    });

    if (!prompt) return errorResponse("البرومت غير موجود", 404);
    return apiResponse(prompt);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب البرومت", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const body = await request.json();
    const parsed = updatePromptSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const data: Record<string, unknown> = { ...parsed.data };
    if (data.tags) data.tags = JSON.stringify(data.tags);

    const updated = await prisma.prompt.update({
      where: { id },
      data,
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(updated);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تعديل البرومت", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({ where: { id }, select: { categoryId: true } });
    if (!prompt) return errorResponse("البرومت غير موجود", 404);

    await prisma.prompt.delete({ where: { id } });

    await prisma.category.update({
      where: { id: prompt.categoryId },
      data: { promptCount: { decrement: 1 } },
    });

    return apiResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حذف البرومت", 500);
  }
}
