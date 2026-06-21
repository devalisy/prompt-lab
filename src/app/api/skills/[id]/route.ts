import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(500).optional(),
  systemPrompt: z.string().min(1).optional(),
  variables: z.string().optional(),
  exampleInput: z.string().optional(),
  tags: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, savedBy: true } },
      },
    });
    if (!skill) return errorResponse("المهارة غير موجودة", 404);
    return apiResponse(skill);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب المهارة", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) return errorResponse("المهارة غير موجودة", 404);
    if (existing.authorId !== user.id) return errorResponse("لا يمكنك تعديل هذه المهارة", 403);

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const skill = await prisma.skill.update({
      where: { id },
      data: parsed.data,
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(skill);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تحديث المهارة", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) return errorResponse("المهارة غير موجودة", 404);
    if (existing.authorId !== user.id && user.role !== "admin") return errorResponse("لا يمكنك حذف هذه المهارة", 403);

    await prisma.skill.delete({ where: { id } });
    return apiResponse({ message: "تم الحذف" });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حذف المهارة", 500);
  }
}
