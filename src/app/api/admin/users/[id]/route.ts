import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

const updateUserSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    if (id === user.id) return errorResponse("لا يمكن حذف حسابك", 400);

    await prisma.user.delete({ where: { id } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حذف المستخدم", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const body = await request.json();

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) return errorResponse("قيمة الدور غير صالحة", 400);

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
    });

    return apiResponse(updated);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل تعديل المستخدم", 500);
  }
}
