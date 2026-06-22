import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "admin@promptlab.com";
const ADMIN_PASSWORD = "Admin@123456";
const SEED_SECRET = process.env.SEED_SECRET ?? "prompt-lab-seed-2026";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("x-seed-secret") ?? "";
    if (auth !== SEED_SECRET) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: {
          password: hashedPassword,
          role: "admin",
          name: existing.name ?? "مدير النظام",
        },
      });
      return NextResponse.json({
        success: true,
        message: "تم تحديث كلمة مرور الأدمن بنجاح",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await prisma.user.create({
      data: {
        name: "مدير النظام",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء حساب الأدمن بنجاح",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "فشل إنشاء الأدمن" },
      { status: 500 }
    );
  }
}