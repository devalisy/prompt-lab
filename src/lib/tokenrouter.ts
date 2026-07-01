import { prisma } from "@/lib/prisma";
import { generateWithProvider } from "@/lib/providers";

export async function generateWithTokenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const providerRecord = await prisma.aiProvider.findFirst({ where: { isActive: true } });
    if (!providerRecord) {
      console.error("[TokenRouter] No active provider found in DB");
      return null;
    }

    const signal = AbortSignal.timeout
      ? AbortSignal.timeout(55000)
      : (() => {
          const c = new AbortController();
          setTimeout(() => c.abort(), 55000);
          return c.signal;
        })();

    const result = await generateWithProvider(
      {
        id: providerRecord.id,
        name: providerRecord.name,
        label: providerRecord.label,
        baseUrl: providerRecord.baseUrl,
        apiKey: providerRecord.apiKey,
        model: providerRecord.model,
        isActive: true,
      },
      systemPrompt,
      userPrompt,
      signal,
    );

    return result?.content ?? null;
  } catch (err) {
    console.error("[TokenRouter] Failed:", err);
    return null;
  }
}
