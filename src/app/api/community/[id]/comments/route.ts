import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { promptId: id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(comments);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل جلب التعليقات", 500);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt) return errorResponse("البرومت غير موجود", 404);

    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "النص طويل جداً", 400);

    const comment = await prisma.comment.create({
      data: { content: parsed.data.content, userId: user.id, promptId: id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return apiResponse(comment, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل إضافة التعليق", 500);
  }
}
