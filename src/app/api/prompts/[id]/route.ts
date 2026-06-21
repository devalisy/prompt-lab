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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, savedBy: true, comments: true } },
      },
    });

    if (!prompt) return errorResponse("البرومت غير موجود", 404);

    await prisma.prompt.update({ where: { id }, data: { usageCount: { increment: 1 } } });

    return apiResponse(prompt);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب البرومت", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing) return errorResponse("البرومت غير موجود", 404);
    if (existing.authorId !== user.id && user.role !== "admin") return errorResponse("غير مصرح بتعديل هذا البرومت", 403);

    const body = await request.json();
    const parsed = updatePromptSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...(parsed.data.title !== undefined && { title: parsed.data.title }),
        ...(parsed.data.content !== undefined && { content: parsed.data.content }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description }),
        ...(parsed.data.level !== undefined && { level: parsed.data.level }),
        ...(parsed.data.tags !== undefined && { tags: JSON.stringify(parsed.data.tags) }),
        ...(parsed.data.categoryId !== undefined && { categoryId: parsed.data.categoryId }),
        ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(prompt);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تحديث البرومت", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing) return errorResponse("البرومت غير موجود", 404);
    if (existing.authorId !== user.id && user.role !== "admin") return errorResponse("غير مصرح بحذف هذا البرومت", 403);

    await prisma.prompt.delete({ where: { id } });

    await prisma.category.update({
      where: { id: existing.categoryId },
      data: { promptCount: { decrement: 1 } },
    });

    return apiResponse({ message: "تم الحذف بنجاح" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حذف البرومت", 500);
  }
}
