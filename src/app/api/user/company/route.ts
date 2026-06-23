import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const memberships = await prisma.companyMember.findMany({
      where: { userId: user.id },
      include: { company: true },
    });

    const companies = memberships.map((m) => ({ ...m.company, role: m.role }));
    return apiResponse(companies);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل جلب الشركات", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    // only admins or privileged users can create companies
    if (!["admin", "privileged"].includes(user.role)) return errorResponse("غير مصرح", 403);

    const body = await request.json();
    const { name, slug, description, logo, defaults, systemPrompt } = body as {
      name: string;
      slug?: string;
      description?: string;
      logo?: string;
      defaults?: Record<string, any>;
      systemPrompt?: string;
    };

    if (!name) return errorResponse("اسم الشركة مطلوب", 400);

    const company = await prisma.company.create({
      data: {
        name,
        slug: slug ?? name.toLowerCase().replace(/[^a-z0-9]+/gi, "-"),
        description,
        logo,
        defaults: defaults ?? {},
        systemPrompt: systemPrompt ?? null,
        ownerId: user.id,
        members: {
          create: [{ userId: user.id, role: "OWNER" }],
        },
      },
    });

    return apiResponse(company, 201);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل إنشاء الشركة", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    const body = await request.json();
    const { id, name, description, logo, defaults, systemPrompt } = body as {
      id: string;
      name?: string;
      description?: string;
      logo?: string;
      defaults?: Record<string, any>;
      systemPrompt?: string;
    };

    if (!id) return errorResponse("معرف الشركة مطلوب", 400);

    const membership = await prisma.companyMember.findUnique({ where: { userId_companyId: { userId: user.id, companyId: id } } });
    if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) return errorResponse("غير مصرح", 403);

    const updated = await prisma.company.update({
      where: { id },
      data: { name, description, logo, defaults, systemPrompt },
    });

    return apiResponse(updated);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "فشل تعديل الشركة", 500);
  }
}
