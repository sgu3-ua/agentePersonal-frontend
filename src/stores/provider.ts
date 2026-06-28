import { defineStore } from "pinia";
import { watch } from "vue";

export type ProviderType = "lmstudio" | "ollama";

export interface ProviderState {
  provider: ProviderType;
  url: string;
  token: string;
}

const STORAGE_KEY = "provider-config";

function loadState(): ProviderState {
  const json = localStorage.getItem(STORAGE_KEY);

  if (!json) {
    return {
      provider: "lmstudio",
      url: "",
      token: "",
    };
  }

  try {
    return JSON.parse(json);
  } catch {
    return {
      provider: "lmstudio",
      url: "",
      token: "",
    };
  }
}

export const useProviderStore = defineStore("provider", {
  state: (): ProviderState => loadState(),

  getters: {
    isConfigured: (state) => {
      return state.url.trim().length > 0;
    },
  },

  actions: {
    setProvider(provider: ProviderType) {
      this.provider = provider;
    },

    setUrl(url: string) {
      this.url = url;
    },

    setToken(token: string) {
      this.token = token;
    },
  },
});

let initialized = false;

export function initProviderStore(store: ReturnType<typeof useProviderStore>) {
  if (initialized) return;

  initialized = true;

  watch(
    () => ({
      provider: store.provider,
      url: store.url,
      token: store.token,
    }),
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    {
      deep: true,
    },
  );
}
