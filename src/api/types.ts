export type ProviderType = "lmstudio" | "ollama";

export type ModelType = "llm" | "embedding";

export interface LoadedInstance {
  id: string;
  config: {
    context_length: number;
    eval_batch_size?: number;
    flash_attention?: boolean;
    num_experts?: number;
    offload_kv_cache_to_gpu?: boolean;
  };
}

export interface Model {
  key: string;
  displayName: string;
  publisher: string;
  type: ModelType;

  architecture?: string;
  quantization?: string;

  sizeBytes: number;
  params?: string;

  maxContextLength: number;

  loaded: boolean;

  loadedInstances: LoadedInstance[];

  format?: string;

  capabilities?: {
    vision: boolean;
    trainedForToolUse: boolean;
  };

  description?: string | null;
}

export interface LoadOptions {
  contextLength?: number;
  evalBatchSize?: number;
  flashAttention?: boolean;
  numExperts?: number;
  offloadKvCacheToGpu?: boolean;
}

export interface ProviderConfig {
  url: string;
  token: string;
}

export interface Chat {
  messages: ChatMessage[];
}
export interface ChatMessage {
  //Un array de string [ "[thinking]blabla", "[toolcall]balbla", "[invalid_tool_call]baba", "[message]babaa" ]
  role: "system" | "user" | "assistant";
  content: string[];
  chatMessageId: string;
}
