import { LMStudioProvider } from "./providers/lmstudio";
import { OllamaProvider } from "./providers/ollama";

import type { AIProvider } from "./providers/base";

import type { ProviderConfig, ProviderType } from "./types";

export function createProvider(
  provider: ProviderType,
  config: ProviderConfig,
): AIProvider {
  switch (provider) {
    case "lmstudio":
      return new LMStudioProvider(config);

    case "ollama":
      return new OllamaProvider(config);

    default:
      throw new Error("Unsupported provider");
  }
}
