import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tips: z.array(z.string()).default([]),
  description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().min(1),
  isPublic: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));
    const search = searchParams.get("search") ?? "";
    const categoryId = searchParams.get("categoryId") ?? "";
    const level = searchParams.get("level") ?? "";

    const where: Record<string, unknown> = { isPublic: true };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (level) where.level = level;

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, savedBy: true, comments: true } },
        },
      }),
      prisma.prompt.count({ where }),
    ]);

    return apiResponse({
      prompts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب البرومتات", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const body = await request.json();
    const parsed = createPromptSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) return errorResponse("التصنيف غير موجود", 400);

    const prompt = await prisma.prompt.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        tips: JSON.stringify(parsed.data.tips),
        description: parsed.data.description,
        level: parsed.data.level ?? "intermediate",
        tags: JSON.stringify(parsed.data.tags ?? []),
        categoryId: parsed.data.categoryId,
        authorId: user.id,
        isPublic: parsed.data.isPublic ?? true,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    await prisma.category.update({
      where: { id: parsed.data.categoryId },
      data: { promptCount: { increment: 1 } },
    });

    return apiResponse(prompt, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إنشاء البرومت", 500);
  }
}
