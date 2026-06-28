import type { LoadOptions, Model, ChatMessage } from "../types";

export interface AIProvider {
  listModels(): Promise<Model[]>;

  loadModel(model: string, options?: LoadOptions): Promise<void>;

  unloadModel(instanceId: string): Promise<void>;

  testConnection(): Promise<boolean>;

  generateText(
    previous_response_id: string | null,
    instanceId: string,
    prompt: string,
    options?: Record<string, any>,
  ): Promise<ChatMessage>;
}
