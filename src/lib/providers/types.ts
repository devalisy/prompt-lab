export interface AiProviderConfig {
  id: string;
  name: string;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  isActive: boolean;
}

export interface GenerateResult {
  content: string;
  finishReason?: string;
}
