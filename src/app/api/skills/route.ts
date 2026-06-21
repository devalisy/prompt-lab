import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  systemPrompt: z.string().min(1),
  variables: z.string().default("[]"),
  exampleInput: z.string().optional(),
  tags: z.string().default("[]"),
  categoryId: z.string().min(1),
  isPublic: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));
    const categoryId = searchParams.get("categoryId") ?? "";

    const where: Record<string, unknown> = { isPublic: true };
    if (categoryId) where.categoryId = categoryId;

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          author: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true, savedBy: true } },
        },
      }),
      prisma.skill.count({ where }),
    ]);

    return apiResponse({
      skills,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب المهارات", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) return errorResponse("التصنيف غير موجود", 400);

    const skill = await prisma.skill.create({
      data: {
        ...parsed.data,
        authorId: user.id,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(skill, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إنشاء المهارة", 500);
  }
}
