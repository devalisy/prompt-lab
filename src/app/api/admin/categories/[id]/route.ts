import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const count = await prisma.prompt.count({ where: { categoryId: id } });
    if (count > 0) return errorResponse(`لا يمكن حذف تصنيف لديه ${count} برومت`, 400);

    await prisma.category.delete({ where: { id } });
    return apiResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل حذف التصنيف", 500);
  }
}
