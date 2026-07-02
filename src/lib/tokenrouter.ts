import { prisma } from "@/lib/prisma";
import { generateWithProvider } from "@/lib/providers";
import type { AiProviderConfig } from "@/lib/providers/types";

function getEnvProviderConfig(): AiProviderConfig | null {
  const apiKey = process.env.TOKENROUTER_API_KEY?.trim();
  const baseUrl = process.env.TOKENROUTER_BASE_URL?.trim() || "https://api.tokenrouter.com/v1";
  const model = process.env.TOKENROUTER_MODEL?.trim() || "gpt-4o";
  if (!apiKey) return null;
  return {
    id: "env-provider",
    name: "tokenrouter",
    label: "TokenRouter (default)",
    baseUrl,
    apiKey,
    model,
    isActive: true,
  };
}

export async function generateWithTokenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    let providerConfig: AiProviderConfig | null = null;

    const dbProvider = await prisma.aiProvider.findFirst({ where: { isActive: true } });
    if (dbProvider) {
      providerConfig = {
        id: dbProvider.id,
        name: dbProvider.name,
        label: dbProvider.label,
        baseUrl: dbProvider.baseUrl,
        apiKey: dbProvider.apiKey,
        model: dbProvider.model,
        isActive: true,
      };
    } else {
      providerConfig = getEnvProviderConfig();
      if (!providerConfig) {
        console.error("[TokenRouter] No active provider in DB and no TOKENROUTER_API_KEY env var");
        return null;
      }
    }

    const signal = AbortSignal.timeout
      ? AbortSignal.timeout(55000)
      : (() => {
          const c = new AbortController();
          setTimeout(() => c.abort(), 55000);
          return c.signal;
        })();

    const result = await generateWithProvider(
      providerConfig,
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
