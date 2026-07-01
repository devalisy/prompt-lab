import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const providers = await prisma.aiProvider.findMany({ orderBy: { createdAt: "desc" } });
    return apiResponse(providers);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل جلب المزودين", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") return errorResponse("غير مصرح", 403);

    const body = await request.json();
    const { name, label, baseUrl, apiKey, model, isActive } = body as {
      name: string;
      label: string;
      baseUrl: string;
      apiKey: string;
      model: string;
      isActive?: boolean;
    };

    if (!name || !label || !baseUrl || !apiKey || !model) {
      return errorResponse("جميع الحقول مطلوبة", 400);
    }

    // if activating, deactivate others first
    if (isActive) {
      await prisma.aiProvider.updateMany({ where: {}, data: { isActive: false } });
    }

    const provider = await prisma.aiProvider.create({
      data: { name, label, baseUrl, apiKey, model, isActive: isActive ?? false },
    });

    return apiResponse(provider, 201);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل إنشاء المزود", 500);
  }
}
