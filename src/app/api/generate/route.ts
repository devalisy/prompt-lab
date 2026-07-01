import { NextRequest } from "next/server";
import { z } from "zod";
import { apiResponse, errorResponse, getAuthUser } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { generateWithAI, streamGenerateWithAI } from "@/lib/ai-generator";

const generateSchema = z.object({
  categoryId: z.string().min(1),
  categoryName: z.string().default(""),
  goal: z.string().min(1).max(500),
  keywords: z.array(z.string()).default([]),
  style: z.enum(["short", "detailed", "creative"]).default("detailed"),
  tone: z.string().optional(),
  audience: z.string().optional(),
  stream: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse("غير مصرح", 401);

    // daily generation limit check (admins bypass)
    if (user.role !== "admin") {
      const today = new Date().toISOString().slice(0, 10);
      const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (fullUser) {
        if (fullUser.dailyGenDate !== today) {
          // reset daily counter
          await prisma.user.update({ where: { id: user.id }, data: { dailyGenCount: 0, dailyGenDate: today } });
          fullUser.dailyGenCount = 0;
          fullUser.dailyGenDate = today;
        }
        if (fullUser.dailyGenCount >= fullUser.dailyGenLimit) {
          return errorResponse(`تجاوزت الحد اليومي المسموح (${fullUser.dailyGenLimit} توليدات). جددّ حدّك غداً.`, 429);
        }
      }
    }

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "بيانات غير صالحة", 400);
    let options = parsed.data as any;

    if (parsed.data.stream) {
      const encoder = new TextEncoder();
      const generator = streamGenerateWithAI(parsed.data);
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of generator) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            const msg = err instanceof Error ? err.message : "خطأ في التوليد";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // apply optional company defaults and systemPrompt if provided
    const companyId = (body as any).companyId as string | undefined;
    if (companyId) {
      try {
        const company = await prisma.company.findUnique({ where: { id: companyId } });
        if (company) {
          if (company.defaults) {
            const { applyCompanyDefaults } = await import("@/lib/prompt");
            options = applyCompanyDefaults(options, company.defaults as any);
          }
          if (company.systemPrompt) {
            options.companySystemPrompt = company.systemPrompt;
          }
        }
      } catch (e) {
        // ignore if company not found
      }
    }

    const result = await generateWithAI(options);

    // increment daily counter (if not admin)
    if (user.role !== "admin") {
      await prisma.user.update({
        where: { id: user.id },
        data: { dailyGenCount: { increment: 1 } },
      });
    }

    return apiResponse(result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "فشل توليد البرومت", 500);
  }
}
