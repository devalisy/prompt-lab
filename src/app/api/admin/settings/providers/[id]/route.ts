import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    const body = await request.json();
    const { name, label, baseUrl, apiKey, model, isActive } = body as any;

    if (isActive) {
      await prisma.aiProvider.updateMany({ where: {}, data: { isActive: false } });
    }

    const updated = await prisma.aiProvider.update({
      where: { id },
      data: { name, label, baseUrl, apiKey, model, isActive },
    });

    return apiResponse(updated);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل تعديل المزود", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const { id } = await params;
    await prisma.aiProvider.delete({ where: { id } });
    return apiResponse({ deleted: true });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل حذف المزود", 500);
  }
}
