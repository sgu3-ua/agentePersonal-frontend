import type { LoadOptions, Model, ProviderConfig, ChatMessage } from "../types";
import type { AIProvider } from "./base";

interface LMStudioModelsResponse {
  models: any[];
}

export class LMStudioProvider implements AIProvider {
  constructor(private readonly config: ProviderConfig) {}

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.config.url}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request<LMStudioModelsResponse>("/api/v1/models");

      return true;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<Model[]> {
    const response =
      await this.request<LMStudioModelsResponse>("/api/v1/models");

    return response.models.map((model) => ({
      key: model.key,

      displayName: model.display_name,

      publisher: model.publisher,

      type: model.type,

      architecture: model.architecture ?? undefined,

      quantization: model.quantization?.name ?? undefined,

      sizeBytes: model.size_bytes,

      params: model.params_string ?? undefined,

      maxContextLength: model.max_context_length,

      loaded: model.loaded_instances.length > 0,

      loadedInstances: model.loaded_instances,

      format: model.format ?? undefined,

      capabilities: model.capabilities
        ? {
            vision: model.capabilities.vision,

            trainedForToolUse: model.capabilities.trained_for_tool_use,
          }
        : undefined,

      description: model.description,
    }));
  }

  async loadModel(model: string, options?: LoadOptions): Promise<void> {
    await this.request("/api/v1/models/load", {
      method: "POST",

      body: JSON.stringify({
        model,

        context_length: options?.contextLength,

        eval_batch_size: options?.evalBatchSize,

        flash_attention: options?.flashAttention,

        num_experts: options?.numExperts,

        offload_kv_cache_to_gpu: options?.offloadKvCacheToGpu,
      }),
    });
  }

  async unloadModel(instanceId: string): Promise<void> {
    await this.request("/api/v1/models/unload", {
      method: "POST",

      body: JSON.stringify({
        instance_id: instanceId,
      }),
    });
  }

  async generateText(
    previous_response_id: string | null,
    instanceId: string,
    prompt: string,
    options?: Record<string, any>,
  ): Promise<ChatMessage> {
    const response = await this.request<{
      output: Array<any>;
      response_id: string;
    }>("/api/v1/chat", {
      method: "POST",
      body: JSON.stringify({
        model: instanceId,
        input: prompt,
        store: false,

        temperature: options?.temperature,
        top_p: options?.top_p,
        top_k: options?.top_k,
        max_output_tokens: options?.max_output_tokens,
        repeat_penalty: options?.repeat_penalty,
        context_length: options?.context_length,
        reasoning: options?.reasoning,

        integrations: options?.integrations,
        system_prompt: options?.system_prompt,
        previous_response_id: previous_response_id,
      }),
    });

    const messages: string[] = [];

    for (const item of response.output ?? []) {
      switch (item.type) {
        case "message":
          messages.push(`[message]${item.content}`);
          break;

        case "reasoning":
          messages.push(`[thinking]${item.content}`);
          break;

        case "tool_call":
          messages.push(
            `[toolcall]{tool:"${item.tool}", args:${JSON.stringify(
              item.arguments,
            )}, output:${JSON.stringify(item.output ?? null)}}`,
          );
          break;

        case "invalid_tool_call":
          messages.push(
            `[invalid_tool_call]{reason:"${item.reason}", meta:${JSON.stringify(
              item.metadata,
            )}}`,
          );
          break;

        default:
          messages.push(`[unknown:${item.type}]${JSON.stringify(item)}`);
      }
    }

    return {
      role: "system",
      content: messages,
      chatMessageId: response.response_id,
    };
  }
}
