import type { LoadOptions, Model, ProviderConfig, ChatMessage } from "../types";

import type { AIProvider } from "./base";

export class OllamaProvider implements AIProvider {
  constructor(private readonly config: ProviderConfig) {}

  async testConnection(): Promise<boolean> {
    throw new Error("Not implemented");
  }

  async listModels(): Promise<Model[]> {
    throw new Error("Not implemented");
  }

  async loadModel(model: string, options?: LoadOptions): Promise<void> {
    throw new Error("Not implemented");
  }

  async unloadModel(instanceId: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async generateText(
    previous_response_id: string | null,
    instanceId: string,
    prompt: string,
    options?: Record<string, any>,
  ): Promise<ChatMessage> {
    throw new Error("Not implemented");
  }
}
