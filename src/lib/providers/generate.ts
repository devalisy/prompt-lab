import type { AiProviderConfig, GenerateResult } from "./types";

export async function generateWithProvider(
  config: AiProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  signal?: AbortSignal
): Promise<GenerateResult | null> {
  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal,
    });

    if (!res.ok) {
      console.error(`Provider ${config.name} API error: ${res.status}`);
      return null;
    }

    const json = await res.json() as {
      choices: { message: { content: string }; finish_reason?: string }[];
    };

    let content = json.choices?.[0]?.message?.content ?? null;
    if (content) {
      content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    }

    if (!content) return null;

    return {
      content,
      finishReason: json.choices?.[0]?.finish_reason,
    };
  } catch (err) {
    console.error(`Provider ${config.name} fetch failed:`, err);
    return null;
  }
}
