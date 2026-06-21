import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const categorySchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().default(""),
  color: z.string().default("#3b82f6"),
  icon: z.string().default("Code"),
  sortOrder: z.number().int().default(0),
});

const categoryUpdateSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { prompts: true } } },
    });

    return apiResponse(categories);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب التصنيفات", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const category = await prisma.category.create({ data: parsed.data });
    return apiResponse(category, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إنشاء التصنيف", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const body = await request.json();
    const parsed = categoryUpdateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);

    const { id, ...data } = parsed.data;
    const category = await prisma.category.update({ where: { id }, data });
    return apiResponse(category);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تعديل التصنيف", 500);
  }
}
