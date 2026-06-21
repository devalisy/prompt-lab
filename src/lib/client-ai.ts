"use client";

let pipelineInstance: unknown = null;
let modelLoading = false;
let modelReady = false;
let downloadProgress = 0;
let progressCallback: ((pct: number) => void) | null = null;

export function onDownloadProgress(cb: (pct: number) => void) {
  progressCallback = cb;
}

export function getStatus() {
  return { modelReady, modelLoading, downloadProgress };
}

async function loadPipeline() {
  if (pipelineInstance) return pipelineInstance;
  if (modelLoading) return null;

  modelLoading = true;
  downloadProgress = 0;

  try {
    const prefix = "@huggingface";
    const mod = await import(prefix + "/transformers");
    const { pipeline } = mod as { pipeline: (task: string, model: string, opts: Record<string, unknown>) => Promise<unknown> };

    pipelineInstance = await pipeline("text-generation", "Xenova/gpt2", {
      quantized: true,
      progressCallback: (pct: number) => {
        downloadProgress = Math.round(pct * 100);
        progressCallback?.(downloadProgress);
      },
    });

    modelReady = true;
    return pipelineInstance;
  } catch (err) {
    console.warn("Local AI model failed to load:", err);
    modelReady = false;
    return null;
  } finally {
    modelLoading = false;
  }
}

export async function initLocalAI(): Promise<boolean> {
  const pipe = await loadPipeline();
  return pipe !== null;
}

export async function enhanceWithLocalAI(text: string, _style: "short" | "detailed" | "creative"): Promise<string> {
  const pipe = await loadPipeline();
  if (!pipe) return text;

  try {
    const prompt = `Arabic prompt: ${text}\nImproved version:`;
    const result = await (pipe as (text: string, params: Record<string, unknown>) => Promise<{generated_text: string}[]>)(prompt, {
      max_new_tokens: 300,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
    });

    const output = result?.[0]?.generated_text ?? "";
    const enhanced = output.replace(prompt, "").trim();
    return enhanced.length > text.length * 0.5 ? enhanced : text;
  } catch {
    return text;
  }
}

export async function analyzeWithAI(content: string) {
  const { analyzePrompt } = await import("@/lib/prompt-analyzer");
  return analyzePrompt(content);
}
